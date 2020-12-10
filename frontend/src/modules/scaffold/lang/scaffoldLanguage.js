
define(function(require) {
  var scaffoldLanguage = {

    helloWorld: function () {
      console.log('hello')
    },

    translate: function (schema) {
      console.log(schema)
      for (var key in schema) {
        console.log(key)
        if(key === '_isVisible') {
          console.log('a key')
          schema[key].title = "A really cool title";
        }
        console.log(schema[key])
      }
      console.log(schema)
      return schema;
    }

  };

return scaffoldLanguage;
});
