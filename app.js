//BUDGET CONTROLLER
var budgetContoller = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    };
    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value
    };
    //data structure
    var data = {
        allItems:{
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return{
        addItem: function(tp, desc, val){
            var newItem, ID;
            //Create new ID
            // ID = data.allItems[tp][data.allItems[tp].length -1].id + 1
                ID = data.allItems[tp].length + 1
            //Create new Item
            if(tp === 'inc'){
                newItem = new Income(ID, desc, val);
                //data.allItems.inc.push(newItem);
            }else if(tp === 'exp'){
                newItem = new Expense(ID, desc, val);
                //data.allItems.exp.push(newItem);
            };
            //Push it into our data structure
            data.allItems[tp].push(newItem);
            // Return the new element
            return newItem
        },
        testing: function() {
            console.log(data);
        }
    }
    /*var DOMStrings = {
        budgetValue:'.budget__value',
        budgetIncomeValue:'.budget__income--value',
        budgetIncomePercentage:'.budget__income--percentage',
        budgetExpensesValue:'.budget__expenses--value',
        budgetExpensesPercentage:'.budget__expenses--percentage'
    }
    */
})();
//UI CONTROLLER
var UIController = (function(){
    var DOMStrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn'
    }
    return {
        getDOMString:function(){
            return DOMStrings;
        },
        getInput: function(){
            return{
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            }
        }
    }
})();
//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    //Events Listeners
    var setupEventListeners = function(){
        var DOM = UICtrl.getDOMString();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keyup', (e) =>{
            if(e.keyCode === 13 || e.which === 13){
                ctrlAddItem();
            }
        });
    };
 
    var ctrlAddItem = function () {
        var input, newItem;

        // 1. Get input field
         input = UICtrl.getInput()

        // 2. change income value
         newItem = budgetCtrl.addItem(input.type,input.description,input.value);

        // 3. Add the item to the UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    };
    return {
        init: function(){
            console.log('The appplication has starter');
            setupEventListeners()
            
        }
    }
})(budgetContoller, UIController);

controller.init()