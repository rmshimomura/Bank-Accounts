// Extern Modules

const inquirer = require('inquirer')
const chalk = require('chalk')

// Intern Modules
const fs = require('fs')

operation()

function operation () {

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What actions do you want to make?',
        choices : [
            'Create account',
            'Check balance',
            'Deposit',
            'Withdraw',
            'Exit'
        ]
    },

    ])
    .then((answer) =>{ 

        const action = answer['action'];
        

    })
    .catch(err => {console.error(err)})

}
