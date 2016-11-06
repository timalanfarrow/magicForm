const magicForm = (function(){
  const $formInput    = $("input");
  const $inputLabel   = $(".input-label");
  const $textArea     = $("textarea");

  const $selectYears  = $("select.year");
  const $selectMonths = $("select.month");
  const $selectDays   = $("select.day");

  const dateMap = {
    1  : 31,
    2  : 28,
    3  : 31,
    4  : 30,
    5  : 31,
    6  : 30,
    7  : 31,
    8  : 31,
    9  : 30,
    10 : 31,
    11 : 30,
    12 : 31
  };

  /*
   * initializes magicForm.
   * - autoresize textareas
   * - customizable actions for input focusing and blurring
   */
  const init = function main() {

    /*
     * ajusts height of textarea automatically
     */
    const h = function adjustHeight(e) {
      $(e).css({'height':'auto','overflow-y':'hidden'}).height(e.scrollHeight);
    }

    $textArea.each( function() {
      h(this);
    }).on('input',  function() {
      h(this);
    }).on('focus blur', ( e ) => {
      const $input = $( e.target );
      const $label = $input.prev(".input-label");

      if( $input.val() != "" )
        return;

      $label.toggleClass("active");
    });

    $formInput.on("focus blur", ( e ) => {
      const $input = $( e.target );
      const $label = $input.prev(".input-label");

      if( $input.val() != "" )
        return;

      $label.toggleClass("active");
    })

    $inputLabel.on("click", ( e ) => {
      const $label = $( e.target );
      const $inputSibling = $label.next("input");

      if( !$inputSibling.length ) $label.next("textarea").focus();

      $inputSibling.focus();
      $label.addClass("active");
    })
  }

  const dateDropDowns = function initializeDateDropDowns() {
    const yearRange = $selectYears[0].dataset.yearRange.split('-');
    let start = yearRange[0];
    let end   = yearRange[1];
    console.log("If there is more than one select.years in this document, you may experience unexpected behavior.")

    $selectYears.append("<option value='default'>Year</option>");
    for( let i = end; i >= start; i-- ) {
      $selectYears.append(`<option value=${ i }>${ i }</option>`);
    }

    $selectMonths.append("<option value='default'>Month</option>");
    for( let i = 1; i < 13; i++ ) {
      $selectMonths.append(`<option value='${ i }'>${ i }</option>`);
    }

    /*
     * $element - jQuery element - select to be updated
     * noOfDays - number - number of days in said month
     *                   - calculated from dateMap
     */
    const updateDays = function changeDaySelectValues( $element, noOfDays ) {
      $element.html("");
      $element.append("<option value='default'>Day</option>")
      for( let i = 1; i < noOfDays + 1; i++ ) {
        $element.append(`<option value='${ i }'>${ i }</option>`);
      }
    }

    // initialize all select.days to have 31 days until specified otherwise.
    updateDays( $selectDays, 31 );

    $selectMonths.on("change", ( e ) => {
      const $changed = $( e.target );

      const month    = $changed.val();
      const noOfDays = dateMap[ month ];

      const $select   = $( "#" + $changed.attr("for") );

      updateDays( $select, noOfDays );
    })
  }

  /*
   * validates form input.
   * $input - jQuery element - input to be validated
   * type   - string - _email, phone number, password_ - type of input
   * fail   - function - action to take on fail
   */
  const validate = function validateFormInput( $input, type, fail = ( $failedInput, warning ) => {

      const $containerDiv = $failedInput.parent();
      $containerDiv.children(".warning").remove();

      $containerDiv.append(`<p class='warning'>${ warning }</p>`);
      return false;
    }, success = ( $failedInput ) => {
      const $warning = $failedInput.parent(".input").children(".warning");

      $warning.remove();
      return true;
    }) {
    const value = $input.val();

    if ( value == undefined )
      console.error("Failed to find value for element:", $failedInput );

    switch( type ) {
      case "email" :
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if( value == "" ){
          const warning = "This is a required field.";
          return fail( $input, warning );
        }
        else if ( !re.test( value ) ) {
          const warning = "Email is not valid!";
          return fail( $input, warning );
        }

        return success( $input );
        break;

      case "password" :
        const length = value.length;

        if( length < 6 ) {
          fail( $input, "Password must be at least 6 characters" );
          return;
        }

        if( $input[0].dataset.confirmPassword != undefined ) {
          const $password = $("#" + $input[0].dataset.confirmPassword );

          if( $password.val() != $input.val() ) {
            fail( $input, "Passwords do not match!" );
            return;
          }
        }
        success( $input );
        break;

      case 'text':

        const textRegEx = /^[0-9a-zA-Z.,! ]+$/;  

          if( value.match( textRegEx )){ 
            return success( $input );
          } 
          else if( value === "" ){
            return fail( $input, "This is a required field.");
          }
          else {
            return fail( $input, "invalid characters used, please try again" );
          }
        break;

      case "phone number" :
          let number = parseInt(value, 10)

          let allNumbers = true 
          for( i in number ) {
            if ( typeof(number[i]) != number) {
              console.log( number[i] + " " + "is" + " " + "Not a Number")
              allNumbers = false;
            }
          }
          if ( value.length != 10 ) {
            return false;
          } 
          else if( !allNumbers ) {
            return false;
          } 
          else {
            return true;
          }
          break;

      default :
        return "unable to determine type";
        break;
    }
  }

  /*
   * Create a custom submit for $form.
   */
  const ajaxSubmit = function submitFormWithAjax( $form ) {
    $form.submit(( e ) => {
      e.preventDefault();

      const $thisForm = $( e.target );
      const data = $thisForm.serializeArray();
      const url  = $thisForm.attr("action");

      console.log( data );
      $.ajax({
        type: "POST",
        url : url,
        data: data,
      });
    })
  }

  return {
    init: init,
    dateDropDowns: dateDropDowns,
    validate: validate,
    ajaxSubmit: ajaxSubmit,
  }
}());
