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

        switch(action) {
            case 'Create account':
                createAccount()
            break
            
        }

    })
    .catch(err => {console.error(err)})

}

function createAccount() {

    console.log(chalk.bgGreen.yellow('Congratulations for using our bank!'))
    console.log(chalk.green('Please choose the account options:'))

    buildAccount()

}

function buildAccount() {

    inquirer.prompt([
        {
            name: "accountName",
            message: "Enter your name:",
        },
        
    ])
    .then((answers) => {

        const accountName = answers["accountName"]
        
        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {

            console.log(chalk.bgRed.white("Account already exists. Please try again"))
            buildAccount()
            return

        } else {

            fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', err => { console.log(err) })
            console.log(chalk.green("Account created successfully."))
            operation()

        }

    })

}