const input = document.querySelectorAll('.login_input');
const progressBar = document.querySelector('.progress_line_work');

input.forEach(inp =>{
    inp.addEventListener('change',function(){
        if(input[0].value.length > 0 || input[1].value.length > 0){
            progressBar.classList.add('active');
        }else{
            progressBar.classList.remove('active');
        }
    })
})
input.forEach(i =>{
    i.addEventListener('focus',function(){
        inputParent = i.parentNode
        inputLabel = i.parentNode.children[1];
        inputLabel.classList.add('active');
        inputParent.classList.add('active');
     
    })
    i.addEventListener('blur',function(){
        if(i.value == i.defaultValue){
            inputParent = i.parentNode
            inputLabel = i.parentNode.children[1];
            inputParent.classList.remove('active');
            inputLabel.classList.remove('active');
        }

    })
})