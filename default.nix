{ pkgs ? import <nixpkgs> {} }:
let
  npmlock2nix = import (pkgs.fetchFromGitHub {
    owner = "tweag";
    repo = "npmlock2nix";
    rev = "7a321e2477d1f97167847086400a7a4d75b8faf8";
    sha256 = "10igdxcc6scf6hksjbbgpj877f6ry8mipz97r2v8j718wd233v6a";
  }) { inherit pkgs; };
  src = pkgs.nix-gitignore.gitignoreSource [ ] ./.;
in
  npmlock2nix.build {
    src = src;
    installPhase = "cp -r dist $out";
  }
