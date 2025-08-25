# Webdev Toolkit

A comprehensive collection of web development tools and CSS generators, built with React. This toolkit aims to speed up common web development tasks by providing easy to use tools like CSS code generators for various CSS properties, color converters, and more.

## Building and testing

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Running locally

1.  Clone the repository:
    ```bash
    git clone https://github.com/theonlyasdk/webdev-toolkit-react.git
    cd webdev-toolkit-react
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  To run the project in development mode:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    This will start the development server, and you can view the application in your browser (usually at `http://localhost:5173`).
    Before this step, in `vite.config.js`, set the value of `base` to `/`.
    
    To enable the Google Fonts search feature in the text properties tool, create a `.env` file in the root directory of the project with the following content:
    ```plaintext
    VITE_GOOGLE_FONTS_API_KEY=<YOUR_GOOGLE_FONTS_API_KEY>
    ```
    To obtain the required API key, refer to the (Google Fonts Developer API)[https://developers.google.com/fonts/docs/developer_api] page.

## Libraries used
Thanks to the following libraries, I was able to build this project:
*   **[React](https://react.dev/) (with [Vite](https://vite.dev/))**
*   **[Bootstrap](https://getbootstrap.com/)**
*   **[React Syntax Highlighter](https://www.npmjs.com/package/react-syntax-highlighter)**

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## Contributors

<!-- readme: theonlyasdk,contributors -start -->

<!-- readme: theonlyasdk,contributors -end -->

## License

Licensed under the [MIT license](LICENSE)
