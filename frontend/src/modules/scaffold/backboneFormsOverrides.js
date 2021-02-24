define([
  'core/origin',
  'backbone-forms'
], function(Origin, BackboneForms) {

  var templates = Handlebars.templates;
  var fieldTemplate = templates.field;
  var templateData = Backbone.Form.Field.prototype.templateData;
  var initialize = Backbone.Form.editors.Base.prototype.initialize;
  var textInitialize = Backbone.Form.editors.Text.prototype.initialize;
  var textAreaRender = Backbone.Form.editors.TextArea.prototype.render;
  var textAreaSetValue = Backbone.Form.editors.TextArea.prototype.setValue;

  Backbone.Form.prototype.constructor.template = templates.form;
  Backbone.Form.Fieldset.prototype.template = templates.fieldset;
  Backbone.Form.Field.prototype.template = fieldTemplate;
  Backbone.Form.NestedField.prototype.template = fieldTemplate;

  // add reset to default handler
  Backbone.Form.Field.prototype.events = {
    'click [data-action="default"]': function() {
      this.setValue(this.editor.defaultValue);
      this.editor.trigger('change', this);

      return false;
    }
  };

  // merge schema into data
  Backbone.Form.Field.prototype.templateData = function() {
    return _.extend(templateData.call(this), this.schema, {
      isDefaultValue: _.isEqual(this.editor.value, this.editor.defaultValue)
    });
  };

  // use default from schema and set up isDefaultValue toggler
  Backbone.Form.editors.Base.prototype.initialize = function(options) {
    var schemaDefault = options.schema.default;

    if (schemaDefault !== undefined && options.id) {
      this.defaultValue = schemaDefault;
    }

    this.listenTo(this, 'change', function() {
      if (this.hasNestedForm) return;

      var isDefaultValue = _.isEqual(this.getValue(), this.defaultValue);

      this.form.$('[data-editor-id="' + this.id + '"]')
        .toggleClass('is-default-value', isDefaultValue);
    });

    initialize.call(this, options);
  };

  // disable automatic completion on text fields if not specified
  Backbone.Form.editors.Text.prototype.initialize = function(options) {
    textInitialize.call(this, options);

    if (!this.$el.attr('autocomplete')) {
      this.$el.attr('autocomplete', 'off');
    }
  };

  // render ckeditor in textarea
  Backbone.Form.editors.TextArea.prototype.render = function() {
    textAreaRender.call(this);
    if (!CKEDITOR.stylesSet.registered.custom) {
      CKEDITOR.stylesSet.add( 'custom', [
        // Block-level default styles
        { name: 'Italic Title', element: 'h2', styles: { 'font-style': 'italic' } },
        { name: 'Subtitle', element: 'h3', styles: { 'color': '#aaa', 'font-style': 'italic' } },
        { name: 'Special Container',
          element: 'div',
          styles: {
            padding: '5px 10px',
            background: '#eee',
            border: '1px solid #ccc'
          }
        },
        // Block-level custom styles
        { name: 'Notice Info', element: 'div', attributes: { 'class': 'notice info icon icon-info-with-circle'},
          styles: {
            'border': 'solid 1px #9eb6d4',
            'background-color': '#e0efff',
            'padding': '1rem'
          }
        },
        { name: 'Notice Note', element: 'div', attributes: { 'class': 'notice note icon icon-warning'},
          styles: {
            'border': 'solid 1px #f7df92',
            'background-color': '#ffffdd',
            'padding': '1rem'
          }
        },
        { name: 'Notice Tip', element: 'div', attributes: { 'class': 'notice tip icon icon-tick'},
          styles: {
            'border': 'solid 1px #9ec49f',
            'background-color': '#ddfade',
            'padding': '1rem'
          }
        },
        { name: 'Notice Warn', element: 'div', attributes: { 'class': 'notice warn icon icon-cross'},
          styles: {
            'border': 'solid 1px #cc0000',
            'background-color': '#ffcccc',
            'padding': '1rem'
          }
        },

        // Inline default styles
        { name: 'Marker', element: 'span', attributes: { 'class': 'marker' } },
        { name: 'Big', element: 'big' },
        { name: 'Small', element: 'small' },
        { name: 'Typewriter', element: 'tt' },
        { name: 'Computer Code', element: 'code' },
        { name: 'Keyboard Phrase', element: 'kbd' },
        { name: 'Sample Text', element: 'samp' },
        { name: 'Variable', element: 'var' },
        { name: 'Deleted Text', element: 'del' },
        { name: 'Inserted Text', element: 'ins' },
        { name: 'Cited Work', element: 'cite' },
        { name: 'Inline Quotation', element: 'q' },
        { name: 'Language: RTL', element: 'span', attributes: { 'dir': 'rtl' } },
        { name: 'Language: LTR', element: 'span', attributes: { 'dir': 'ltr' } },

        /* Object styles */
        { name: 'Styled Image (left)',
          element: 'img',
          attributes: { 'class': 'left' }
        },
        { name: 'Styled Image (right)',
          element: 'img',
          attributes: { 'class': 'right' }
        },
        { name: 'Compact Table',
          element: 'table',
          attributes: {
            cellpadding: '5',
            cellspacing: '0',
            border: '1',
            bordercolor: '#ccc'
          },
          styles: {
            'border-collapse': 'collapse'
          }
        },
        { name: 'Borderless Table', element: 'table', styles: { 'border-style': 'hidden', 'background-color': '#E6E6FA' } },
        { name: 'Square Bulleted List', element: 'ul', styles: { 'list-style-type': 'square' } },

        /* Widget styles */
        { name: 'Clean Image', type: 'widget', widget: 'image', attributes: { 'class': 'image-clean' } },
        { name: 'Grayscale Image', type: 'widget', widget: 'image', attributes: { 'class': 'image-grayscale' } },
        { name: 'Featured Snippet', type: 'widget', widget: 'codeSnippet', attributes: { 'class': 'code-featured' } },
        { name: 'Featured Formula', type: 'widget', widget: 'mathjax', attributes: { 'class': 'math-featured' } },

        { name: '240p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-240p' }, group: 'size' },
        { name: '360p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-360p' }, group: 'size' },
        { name: '480p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-480p' }, group: 'size' },
        { name: '720p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-720p' }, group: 'size' },
        { name: '1080p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-1080p' }, group: 'size' },

        // Adding space after the style name is an intended workaround. For now, there
        // is no option to create two styles with the same name for different widget types. See https://dev.ckeditor.com/ticket/16664.
        { name: '240p ', type: 'widget', widget: 'embed', attributes: { 'class': 'embed-240p' }, group: 'size' },
        { name: '360p ', type: 'widget', widget: 'embed', attributes: { 'class': 'embed-360p' }, group: 'size' },
        { name: '480p ', type: 'widget', widget: 'embed', attributes: { 'class': 'embed-480p' }, group: 'size' },
        { name: '720p ', type: 'widget', widget: 'embed', attributes: { 'class': 'embed-720p' }, group: 'size' },
        { name: '1080p ', type: 'widget', widget: 'embed', attributes: { 'class': 'embed-1080p' }, group: 'size' }
      ]);
    };
    CKEDITOR.config.stylesSet = 'custom';

    _.defer(function() {
      this.editor = CKEDITOR.replace(this.$el[0], {
        allowedContent: true,
        dataIndentationChars: '',
        disableNativeSpellChecker: false,
        enterMode: CKEDITOR[Origin.constants.ckEditorEnterMode],
        entities: false,
        extraAllowedContent: Origin.constants.ckEditorExtraAllowedContent,
        extraPlugins: 'image2,codesnippet',
        on: {
          change: function() {
            this.trigger('change', this);
          }.bind(this),
          instanceReady: function() {
            var writer = this.dataProcessor.writer;
            var elements = Object.keys(CKEDITOR.dtd.$block);

            var rules = {
              indent: false,
              breakBeforeOpen: false,
              breakAfterOpen: false,
              breakBeforeClose: false,
              breakAfterClose: false
            };

            writer.indentationChars = '';
            writer.lineBreakChars = '';
            elements.forEach(function(element) { writer.setRules(element, rules); });
          }
        },
        toolbar: [
          { name: 'document', items: [ 'Source', 'CodeSnippet' ] },
          { name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', 'Undo', 'Redo' ] },
          { name: 'editing', items: [ 'Find', 'Replace', 'SelectAll' ] },
          { name: 'forms', items: [ '-' ] },
          { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
          '/',
          { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language' ] },
          { name: 'links', items: [ 'Link', 'Unlink' ] },
          { name: 'insert', items: [ 'Image', 'Table', 'HorizontalRule', 'SpecialChar', 'Iframe' ] },
          '/',
          { name: 'styles', items: [ 'Styles', 'Format', 'Font', 'FontSize' ] },
          { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
          { name: 'tools', items: [ 'Maximize', 'ShowBlocks' ] },
          { name: 'about', items: [ '-' ] }
        ]
      });
    }.bind(this));

    return this;
  };

  // get data from ckeditor in textarea
  Backbone.Form.editors.TextArea.prototype.getValue = function() {
    return this.editor.getData();
  };

  // set value in ckeditor
  Backbone.Form.editors.TextArea.prototype.setValue = function(value) {
    textAreaSetValue.call(this, value);

    if (this.editor) {
      this.editor.setData(value);
    }
  };

  // ckeditor removal
  Backbone.Form.editors.TextArea.prototype.remove = function() {
    this.editor.removeAllListeners();
    CKEDITOR.remove(this.editor);
  };

  // add override to allow prevention of validation
  Backbone.Form.prototype.validate = function(options) {
    var self = this,
        fields = this.fields,
        model = this.model,
        errors = {};

    options = options || {};

    //Collect errors from schema validation
    // passing in validate: false will stop validation of the backbone forms validators
    if (!options.skipModelValidate) {
      _.each(fields, function(field) {
        var error = field.validate();

        if (!error) return;

        var title = field.schema.title;

        if (title) {
            error.title = title;
        }

        errors[field.key] = error;
      });
    }

    //Get errors from default Backbone model validator
    if (!options.skipModelValidate && model && model.validate) {
      var modelErrors = model.validate(this.getValue());

      if (modelErrors) {
        var isDictionary = _.isObject(modelErrors) && !_.isArray(modelErrors);

        //If errors are not in object form then just store on the error object
        if (!isDictionary) {
          errors._others = errors._others || [];
          errors._others.push(modelErrors);
        }

        //Merge programmatic errors (requires model.validate() to return an object e.g. { fieldKey: 'error' })
        if (isDictionary) {
          _.each(modelErrors, function(val, key) {
            //Set error on field if there isn't one already
            if (fields[key] && !errors[key]) {
              fields[key].setError(val);
              errors[key] = val;
            }

            else {
              //Otherwise add to '_others' key
              errors._others = errors._others || [];
              var tmpErr = {};
              tmpErr[key] = val;
              errors._others.push(tmpErr);
            }
          });
        }
      }
    }

    return _.isEmpty(errors) ? null : errors;
  };

  // allow hyphen to be typed in number fields
  Backbone.Form.editors.Number.prototype.onKeyPress = function(event) {
    var self = this,
      delayedDetermineChange = function() {
        setTimeout(function() {
        self.determineChange();
      }, 0);
    };

    //Allow backspace
    if (event.charCode === 0) {
      delayedDetermineChange();
      return;
    }

    //Get the whole new value so that we can prevent things like double decimals points etc.
    var newVal = this.$el.val()
    if( event.charCode != undefined ) {
      newVal = newVal + String.fromCharCode(event.charCode);
    }

    var numeric = /^-?[0-9]*\.?[0-9]*?$/.test(newVal);

    if (numeric) {
      delayedDetermineChange();
    }
    else {
      event.preventDefault();
    }
  };

});
