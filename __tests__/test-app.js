import("../dist/reconciler/index.js")
  .then(({ render }) => {
    const App = () => {
      return React.createElement("VBOX", null, "Hello world!");
    };

    render(React.createElement(App));
  })
  .catch((e) => {
    console.log(e);
  });
