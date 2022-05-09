
# Indicadores Backend
This projects servs as the backend for the IMPLAN's website and management application.

The backend itself is implemented in Nodejs using the following technologies:
- ExpressJS.
- Swagger.
- Sinon, chai and mocha.


## API Reference

#### For the complete API reference forward to the documentation made with Swagger, available in the following route:

```
  GET /api/v1/documentation
```



## Running Tests

To run tests, the following commands are acceptable.

```bash
  npm run test
  npx nyc mocha src/test/services/*.js src/test/controllers/*.js
  npx mocha src/test/services/*.js src/test/controllers/*.js
```


## Authors

- [@luisccc99](https://www.github.com/ImMorales)
- [@ImMorales](https://www.github.com/luisccc99)
- [@MiquelVald](https://www.github.com/MiquelVald)


## Used By

This project is used by the following companies:

- Instituto Municipal de Planeación (IMPLAN Chihuahua)

