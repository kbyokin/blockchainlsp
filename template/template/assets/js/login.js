const input = document.querySelectorAll('.login_input');
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