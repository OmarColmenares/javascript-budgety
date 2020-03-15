var budgetContoller = (function(){
 
})();

var UIController = (function(){
 
})();

var controller = (function(budgetCtrl, UICtrl){
    
    var ctrlAddItem = function () {
        // 1. Get input field
        var description = document.querySelector('.add__description').value;
        var val = document.querySelector('.add__value').value;
        // 2. change income value
        console.log(this)
        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    document.querySelector('.add__btn').addEventListener('click', () =>{
        console.log('the event works!');
        
        
    });

    document.addEventListener('keyup', (e) =>{
        console.log(e);
        ctrlAddItem();
    });

})(budgetContoller, UIController);