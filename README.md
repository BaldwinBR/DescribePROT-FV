# DescribePROT-FV

The **DescribePROT Feature Viewer** is composed of two core libraries:

- **DescribePROT-FV**: Serves as the primary library responsible for constructing feature panels from provided data.

- **FeatureViewerTypeScript**: A fork of the original [BioComputing FeatureViewer](http://protein.bio.unipd.it/feature-viewer) library, customized to fit the specific requirements of DescribePROT. This fork exists as a submodule within DescribePROT-FV and handles the core logic for how features are generated and displayed.

The viewer is designed to generate **server-ready, self-contained HTML files**, instead of executing feature panel logic directly on the server.

The DescribePROT fork of FeatureViewerTypeScript can be found here:  
[https://github.com/BaldwinBR/FeatureViewerTypeScript.git](https://github.com/BaldwinBR/FeatureViewerTypeScript.git)

