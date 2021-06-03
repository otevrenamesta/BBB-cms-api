const webdav = require('webdav-server').v2
try {
  const webDavUsers = JSON.parse(process.env.WEBDAV_USERS)
} catch (e) {
  throw new Error('process.env.WEBDAV_USERS not valid JSON!')
}

function getUserByName(uname, domain) {

}

export default class MyDigestAuth extends webdav.HTTPDigestAuthentication {
  getUser(ctx, callback) {
    const domain = ctx.requested.path.paths[1]
    var _this = this;
    var onError = function (error) {
        _this.userManager.getDefaultUser(function (defaultUser) {
            callback(error, defaultUser);
        });
    };
    var authHeader = ctx.headers.find('Authorization');
    if (!authHeader)
        return onError(webdav.Errors.MissingAuthorisationHeader);
    var authProps;
    try {
        authProps = parseHTTPAuthHeader(authHeader, 'Digest');
    }
    catch (ex) {
        return onError(webdav.Errors.WrongHeaderFormat);
    }
    if (!(authProps.username && authProps.uri && authProps.nonce && authProps.response))
        return onError(webdav.Errors.AuenticationPropertyMissing);
    if (!authProps.algorithm)
        authProps.algorithm = 'MD5';
    
    const user = getUserByName(authProps.username, domain)
    if (!user)
        return onError(Errors.BadAuthentication);

    var ha1 = md5(authProps.username + ":" + _this.realm + ":" + (user.password ? user.password : ''));
    if (authProps.algorithm === 'MD5-sess')
        ha1 = md5(ha1 + ":" + authProps.nonce + ":" + authProps.cnonce);
    var requestedUri = ctx.requested.uri;
    var digestUri = authProps.uri || requestedUri;
    if (digestUri !== requestedUri) {
        var uriMismatch = void 0;
        switch (digestUri.length - requestedUri.length) {
            case -1:
                uriMismatch = !startsWith(requestedUri, digestUri) || requestedUri[digestUri.length] !== '/';
                break;
            case 1:
                uriMismatch = !startsWith(digestUri, requestedUri) || digestUri[requestedUri.length] !== '/';
                break;
            default:
                uriMismatch = true;
                break;
        }
        if (uriMismatch) {
            return onError(Errors.BadAuthentication);
        }
    }
    var ha2;
    if (authProps.qop === 'auth-int')
        return onError(Errors.WrongHeaderFormat); // ha2 = md5(ctx.request.method.toString().toUpperCase() + ':' + digestUri + ':' + md5(...));
    else
        ha2 = md5(ctx.request.method.toString().toUpperCase() + ":" + digestUri);
    var result;
    if (authProps.qop === 'auth-int' || authProps.qop === 'auth')
        result = md5(ha1 + ":" + authProps.nonce + ":" + authProps.nc + ":" + authProps.cnonce + ":" + authProps.qop + ":" + ha2);
    else
        result = md5(ha1 + ":" + authProps.nonce + ":" + ha2);
    if (result.toLowerCase() === authProps.response.toLowerCase())
        callback(Errors.None, user);
    else
        onError(Errors.BadAuthentication)

  }
}