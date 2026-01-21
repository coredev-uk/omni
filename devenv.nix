{ pkgs, ... }:

let
  gtkDependencies = with pkgs; [
    gtk3
    glib
    gdk-pixbuf
    cairo
    pango
    harfbuzz
    at-spi2-atk
    atkmm
    gobject-introspection
    librsvg
    libsoup_3
    webkitgtk_4_1
  ];

  electronDependencies = with pkgs; [
    mesa
  ];
in

{
  name = "Melos";

  packages =
    with pkgs;
    [
      git
      openssl_3
      pkg-config
      rustup
    ]
    ++ electronDependencies
    ++ gtkDependencies
    ++ [
      gst_all_1.gstreamer
      gst_all_1.gst-plugins-base
      gst_all_1.gst-plugins-good
      gst_all_1.gst-plugins-bad
      gst_all_1.gst-plugins-ugly
      gst_all_1.gst-libav
      gst_all_1.gst-vaapi
    ];

  languages = {
    rust = {
      enable = true;
      components = [
        "rustc"
        "cargo"
        "clippy"
        "rustfmt"
        "rust-analyzer"
      ];
    };

    # Frontend
    javascript.enable = true;
    typescript.enable = true;
  };

  scripts = {
    greet.exec = ''echo "🎵 Welcome to Melos development environment!" && bun pm ls'';
    dev.exec = "npm run tauri dev";
  };

  enterShell = ''
    greet
  '';

  env = {
    LD_LIBRARY_PATH = "${pkgs.mesa}/lib:$LD_LIBRARY_PATH";

    # Required for pkg-config to find libraries
    PKG_CONFIG_PATH = builtins.concatStringsSep ":" (map (p: "${p.dev}/lib/pkgconfig") gtkDependencies);

    # Fixes issues with webkit rendering
    WEBKIT_DISABLE_DMABUF_RENDERER = "1";

    # Paths for GStreamer plugins
    GST_PLUGIN_SYSTEM_PATH_1_0 = builtins.concatStringsSep ":" (
      map (p: "${p}/lib/gstreamer-1.0") [
        pkgs.gst_all_1.gstreamer
        pkgs.gst_all_1.gst-plugins-base
        pkgs.gst_all_1.gst-plugins-good
        pkgs.gst_all_1.gst-plugins-bad
        pkgs.gst_all_1.gst-plugins-ugly
        pkgs.gst_all_1.gst-libav
        pkgs.gst_all_1.gst-vaapi
      ]
    );
  };
}
