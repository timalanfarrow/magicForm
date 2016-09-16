# magicForm
Validate forms, and use custom animations for form events.

Magic Form is dependent on jQuery.

# Formatting HTML for best results
HTML inputs, textareas, and selects should be laid out in wrapper divs with the class, .input. This allows us to package labels and form elements together. Here's an example of a form:

```
<form action='/' method='post'>
    <div class='input'>
        <p class='input-label'>Name</p>
        <input type='text' />
    </div>
    <div class='input'>
        <p class='input-label'>Email</p>
        <input class='email-input' type='text' />
    </div>
    <input type='submit' />
</form>
```

# Initializing the Module
1. Download the module.
2. Call the following function.

`magicForm.init();`

After initializing Magic Form, all of your textareas will resize automatically to fit content, and the class 'active' will be applied to any label for a textarea, or input that has content, or is currently focused.

# Validating form Entries
Once magicForm has been included into your project, you can call

`magicForm.validate( $input, type );`

Where $input is a jQuery form element to be validated, and type is "email", or "password". If the validation fails, a warning will be appended to the bottom of the relevant .input div in the form of a p tag with the class warning.

# Dropdowns
Dropdowns do *not* need to be wrapped in a div with the class input.

## Date Dropdowns
Magic Form makes date dropdowns easy. There are three kinds of selects which you can use for a date. These are defined by the classes
.month, .day, and .year. The default value for any date dropdown is 'default'. 

Date Dropdowns should be initialized by

`magicForm.dateDropDowns();`

### select.month
The .month select will auto populate with the options 1 to 12. You can link this to a .day select by using the for attribute of the select. The for attribute should be the same text as the id of the corresponding day select.
For example:

```
<form action="/" method="post">
    <div class="dropdown">
        <select name="month" class="month" for="days"></select>
    </div>
    <div class="dropdown">
        <select name="day" class="day" id="days"></select>
    </div>
</form>
```
Now, when the month select changes, it will automatically update the #days select so that it has the correct number of days, e.g. if the month is 2, then the day will now have 28 day options.

### select.day
The select.day select will be automatically populated with options with values from one to thirty one. If a linked .month select is changed (read above, select.months) then this select will be automatically populated.

### select.year
A year dropdown can now be easily populated with Magic Form. Simply specify the attribute data-year-range as a string like yyyy-yyyy or yy-yy. And it will automatically populate your select with options from the first year to the last year.

For example: The .year select will have options from 1930 to 2016.

`<select name="year" class="year" data-year-range="1930-2016"></select>`

# Submitting forms with Ajax
Magic Form allows for forms to be submitted without reloading the page. In order to specify that a form should be submitted using Ajax, call:

```
const $form = $("[insert form selector]");
magicForm.ajaxSubmit( $form );
```

This form will be submitted in the form of a POST request regardless of the form's specification. The action of this Ajax request, however, will be the action specified by the action attribute of the form.
