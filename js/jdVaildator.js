(function(global, factory) {
  global.jdValidate = global.jV = factory(global);
})(window, factory);

function factory(global) {
  let jdValidate = function(form, trigger) {
    return new jdValidate.init(form, trigger);
  };
  jdValidate.prototype = {
    makeInputArray: function() {
      this.inputs.forEach(el => {
        let vType = el.getAttribute("data-vtype");
        let vErrorText = el.getAttribute("data-verror");
        if (vType) {
          this.validationArray.push({
            name: el.name,
            type: el.type,
            vType,
            vErrorText
          });
        }
      });
    },
    validateForm: function() {
      this.makeInputArray();
      if (!this.trigger) {
        if (this.form.tagName === "FORM") {
          this.addListeners("form");
        }
      } else {
        this.addListeners("trigger");
      }
    },
    addListeners: function(type) {
      switch (type) {
        case "form":
          this.form.addEventListener("submit", e => {
            e.preventDefault();
            this.validateInputs();
          });
          break;
        case "trigger":
          this.trigger.addEventListener("click", () => {
            this.validateInputs();
          });
          break;
        default:
          break;
      }
    },
    validateInputs: function() {
      this.validationArray.forEach(obj => {
        let el = "";
        switch (obj.type) {
          case "text":
            el = this.form.querySelectorAll(`[name=${obj.name}]`)[0];
            this.validateTextInput(el, obj.vType, obj.vErrorText);
            break;
          case "email":
            el = this.form.querySelectorAll(`[name=${obj.name}]`)[0];
            this.validateEmailInput(el, obj.vType, obj.vErrorText);
            break;
          default:
            console.error("Feature still in Development");
            break;
        }
      });
    },
    validateTextInput: function(el, vtype, verror) {
      switch (vtype) {
        case "required":
          if (el.value === "" || el.value === undefined || el.value === null) {
            this.displayError(el, verror ? verror : "Required Text");
          } else {
            this.removeError(el);
          }
          break;
        default:
          console.error("Feature still in Development");
          break;
      }
    },
    validateEmailInput: function(el, vtype, verror) {
      switch (vtype) {
        case "required":
          if (el.value === "" || el.value === undefined || el.value === null) {
            this.displayError(el, verror ? verror : "Required Email");
          } else {
            this.removeError(el);
          }
          break;
        default:
          console.error("Feature still in Development");
          break;
      }
    },
    displayError: function(el, text) {
      let parent = el.parentElement;
      el.classList.add("has-error");
      let errorSpan = global.document.createElement("span");
      errorSpan.classList.add("jd-error-span");
      let textNode = global.document.createTextNode(text);
      errorSpan.appendChild(textNode);
      let currentError = parent.querySelectorAll("span.jd-error-span")[0];
      if (!currentError) {
        parent.appendChild(errorSpan);
      } else {
        currentError.innerHTML = "";
        currentError.appendChild(textNode);
      }
    },
    removeError: function(el) {
      let error = el.parentElement.querySelectorAll("span.jd-error-span")[0];
      if (error) {
        el.parentNode.removeChild(error);
        el.classList.remove("has-error");
      }
    }
  };
  jdValidate.init = function(form, trigger) {
    this.form = form;
    this.trigger = trigger;
    this.inputs = this.form.querySelectorAll("input");
    this.validationArray = [];
    this.validateForm();
  };

  jdValidate.init.prototype = jdValidate.prototype;
  return jdValidate;
}
