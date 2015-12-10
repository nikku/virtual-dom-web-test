# virtual-dom-web-test

A simple client side web application testing [virtual-dom](https://github.com/Matt-Esch/virtual-dom) for application development.


## Develop

```
# spin up server
npm run dev

# run tests
npm test

# bundle
npm run build
```


## Structure

```
client
├── lib
│   ├── app                         <-- application components
│   │   ├── index.js
│   │   ├── Log.js
│   │   └── tabs
│   │       └── ...
│   ├── base                        <-- base components
│   │   ├── Actions.js
│   │   ├── BaseComponent.js
│   │   └── components
│   │       └── ...
│   ├── index.html                  <-- HTML
│   ├── index.js                    <-- JS (bootstrapping code)
│   ├── style.less                  <-- CSS (bootstrapping)
│   ├── util
│   │   ├── bind.js
│   │   ├── ensure-opts.js
│   │   ├── has-property.js
│   │   └── slice.js
│   └── vdom                        <-- virtual-dom helpers
│       ├── create-component.js
│       ├── h.js
│       └── hooks
│           └── ...
└── test
    ├── config
    │   └── karma.unit.js
    ├── helper
    │   └── ...
    └── spec
        └── BpmnTabSpec.js
```


## Notes

* State may be [handled by the app](https://github.com/nikku/virtual-dom-web-test/blob/master/client/lib/app/index.js#L27) and [propagated down to components](https://github.com/nikku/virtual-dom-web-test/blob/master/client/lib/app/index.js#L210)
* State may be [handled in a component](https://github.com/nikku/virtual-dom-web-test/blob/master/client/lib/app/tabs/views/BpmnEditor.js#L23), too (allowing decoupling + independent components)
* [App](https://github.com/nikku/virtual-dom-web-test/blob/master/client/lib/app/index.js#L104) is an event emitter and hooks up all other components through life-cycle events
* Only sparse use of inheritance at the moment, the most simply component can simply expose a `#render` method in order to plug into the application
* Other functionality, such as external libraries for dialogs and stuff can simply be added _outside_ the application
* Testing works work via [shadom dom testing](https://github.com/nikku/virtual-dom-web-test/blob/master/client/test/spec/app/tabs/views/BpmnEditorSpec.js#L46)


## License

MIT