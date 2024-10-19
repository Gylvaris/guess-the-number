{
  description = "Number guessing game development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
    ...
  }: let
    system = "x86_64-linux";
  in {
    devShells."${system}".default = let
      pkgs = import nixpkgs {
        inherit system;
      };
    in
      pkgs.mkShell {
        packages = with pkgs; [
          deno
          zsh
        ];

        shellHook = ''
          echo "deno `${pkgs.deno}/bin/deno --version`"
          exec zsh
        '';
      };
  };
}
