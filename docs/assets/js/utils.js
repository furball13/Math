export class Utils {
  static getFormInputs(selector, allInputs = true) {
    /* Get form controls from page */
    const controls = {};
    if (allInputs) { selector += ' input'; }
    document.querySelectorAll(selector).forEach(function(field) {
      if (field.tagName.toLowerCase() !== 'input') {
        return; // Skip non-input elements
      }
    
      switch (field.type) {
	case 'checkbox':
	case 'radio':
	  // For checkboxes and radio buttons, store their 'checked' state
	  controls[field.id] = field.checked;
	  break;
	case 'select-multiple':
	  // For multiple select elements, collect all selected options
	  const selectedOptions = Array.from(field.selectedOptions).map(option => option.value);
	  controls[field.id] = selectedOptions;
	  break;
	case 'file':
	  // For file inputs, store the File object itself
	  controls[field.id] = field.files[0]; // Assuming only one file is selected
	  break;
	default:
	  // For other input types (text, email, password, select-single, textarea), store their 'value'
	  controls[field.id] = field.value;
	  break;
      }
    });

    return controls;
  }

  static randomIntegerInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}