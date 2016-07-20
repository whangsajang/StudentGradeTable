/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds=['studentName', 'grade', 'course'];
/**
 * addClicked - Event Handler when user clicks the add button
 */


/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(){
     var new_students ={};
       new_students.name = $('#studentName').val();
       new_students.grade = $('#studentGrade').val();
       new_students.course = $('#course').val();
       student_array.push(new_students);
    console.log('student array: ', student_array);

    $.ajax({
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/sgt/create',
        dataType: 'json',
        data: {
            api_key: 'qvq86U1xAs',
            name: new_students.name,
            grade: new_students.grade,
            course: new_students.course
        },
        success: function(result) {
                console.log(result);
                console.log('success');
            }
    });

    
    console.log(student_array);
    var numb = student_array;
    calculateAverage(numb);
    clearAddStudentForm();
}
/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
};

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(numberArray){
    var total = null;
    for(var x =0; x < numberArray.length; x++){
        total += parseInt(numberArray[x].Grade);
        console.log(numberArray[x].Grade)
    }
    $('.avgGrade').text(Math.ceil(total/x));
    return total/x;



}
/**
 * updateData - centralized function to update the average and call student list update
 */
function updateData(){
    updateStudentList();
    calculateAverage(student_array);
}

/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList (){
    $('tbody tr').remove();
    for(var x = 0; x < student_array.length; x++){
        //student_array[x].push(addStudentToDom())
        addStudentToDom(student_array[x])
    }

}
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj) {
    var trow = $('<tr>');
    var tdrow = $('<td>');
    var studName = studentObj.name;
    var studCourse = studentObj.course;
    var studGrade = studentObj.grade;
    var rowStudent = $('<td>').addClass('col-md-2').text(studName);
    var rowCourse = $('<td>').addClass('col-md-2').text(studCourse);
    var grade = $('<td>').addClass('col-md-2').text(studGrade);
    // var delBut = $('<td>').html("<button type='button' onclick='deleteStudent()' class='col-sm-4 col-md-4 col-lg-4 btn btn-danger' data-index='4'>DELETE</button>");
    var delBut = $('<button>', {
        class: 'col-sm-4 col-md-4 col-lg-4 btn btn-danger',
        text: 'DELETE',
        data_id: studentObj.id
    });
    $(tdrow).append(delBut);

    var tables = $(trow).append(rowStudent, rowCourse, grade, tdrow);
    $('tbody').append(tables);
    delBut.click(function () {
        var trow = $(this).parent();
        student_array.splice(student_array.indexOf(studentObj), 1);
        $(trow).remove();
        $.ajax({
            dataType: 'json',
            method: 'POST',
            url: 'http://s-apis.learningfuze.com/sgt/delete',
            data: {api_key: 'qvq86U1xAs', student_id: $(this).attr('data_id')},
            success: function (result) {
                console.log(result);
                console.log('Delete FROM HERE API');
            }
        });

        updateData();
        console.log('hello');
        
    });
}
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){
  student_array = [];
    $('tbody tr').remove();

}
function getData() {
    $.ajax({
        dataType: 'json',
        method: 'POST',
        url: 'http://s-apis.learningfuze.com/sgt/get',
        data: {api_key: 'qvq86U1xAs'},
        success: function (result) {
            var jsonData = result.data;
            console.log(jsonData);
            for (var i = 0; i < jsonData.length; i++) {
                student_array.push(jsonData[i]);
            }
            updateStudentList();
        }
    })
}
/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function(){
    $('.cancelClicked').click(function(){
        clearAddStudentForm()
    });

    $('.addClicked').click(function(){
        addStudent();
        updateData();
    });


});