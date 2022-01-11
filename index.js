// Extern Modules

const inquirer = require('inquirer')
const chalk = require('chalk')

// Intern Modules
const fs = require('fs')

// Operation
operation()

function operation() {

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What actions do you want to make?',
        choices: [
            'Create account',
            'Check balance',
            'Deposit',
            'Withdraw',
            'Transfer between accounts',
            'Check interest rate',
            'Exit'
        ]
    },

    ])
        .then((answer) => {

            const action = answer['action'];

            switch (action) {
                case 'Create account':
                    createAccount()
                    break

                case 'Check balance':
                    getAccountBalance()
                    break

                case 'Deposit':
                    deposit()
                    break

                case 'Withdraw':
                    withdraw()
                    break

                case 'Transfer between accounts':
                    transfer()
                    break

                case 'Check interest rate':
                    interestRate()
                    break

                case 'Exit':
                    console.log(chalk.bgBlue.white('Thanks for using accounts service!'));
                    process.exit();
                    
            }

        })
        .catch(err => { console.error(err) })

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

            if(!accountName) {
                console.log(chalk.bgRed.black("An error occurred, please try again later"))
                return buildAccount()
            }

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts')
            }

            if (fs.existsSync(`accounts/${accountName}.json`)) {

                console.log(chalk.bgRed.black("Account already exists. Please try again"))
                buildAccount()
                return

            } else {

                fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', err => { console.log(err) })
                console.log(chalk.green("Account created successfully."))
                operation()

            }

        })

}

function deposit() {

    inquirer.prompt([
        {

            name: 'accountName',
            message: 'Please enter your account name'

        }
    ])
        .then(answer => {

            const accountName = answer['accountName']

            if(!checkAccount(accountName)) {

                return deposit()

            } else {

                inquirer.prompt([

                    {
                        name: 'depositValue',
                        message: 'Please enter the amount of the deposit:'
                    },

                ])
                .then(answer => {

                    const amount = answer['depositValue']
                    
                    addAmount(accountName, parseFloat(amount))

                    operation()

                })
                .catch(err => { console.log(err) })

            }

        })
        .catch(err => { console.log(err) })

}

function checkAccount(accountName) {

    if(!fs.existsSync('accounts/' + accountName + '.json')){

        console.log(chalk.bgRed.black("Account doesn't exist."))
        return false

    } else {

        return true

    }

}

function addAmount(accountName, amount) {

    const account = getAccount(accountName)

    if(!amount || amount < 0) {

        console.log(chalk.bgRed.black("An error occurred, please try again later"))
        return deposit()

    }

    account['balance'] += amount

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account), err => {console.log(err)})

    console.log(chalk.green.bold(`Deposit of U$${amount} successfully made on account ${accountName}`))

}

function getAccount(accountName) {

    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {encoding: 'utf8', flag: 'r'})

    return JSON.parse(accountJSON)

}

function getAccountBalance(){

    inquirer.prompt([

        {

            name: 'accountName',
            message: 'Please enter your account name'

        }

    ])
    .then(answers => {

        const accountName = answers['accountName']

        if(!checkAccount(accountName)) {
            
            return getAccountBalance()

        } else {

            const accountData = getAccount(accountName)

            console.log(chalk.bgBlue.black(`Hello, your account balance is U$${accountData.balance}`))

            operation()

        }

    })
    .catch(err => console.log(err))

}

function withdraw() {
    
    inquirer.prompt([

        {
            name: 'accountName',
            message: "What's your account name?"
        }

    ])
    .then(answers => {

        const accountName = answers['accountName']

        if(!checkAccount(accountName)) {

            return withdraw()

        } else {

            inquirer.prompt([

                {
                    name: 'withdrawValue',
                    message: 'Please enter the amount of the withdraw:'
                },

            ])
            .then(answer => {

                const amount = answer['withdrawValue']
                
                removeAmount(accountName, parseFloat(amount))

            })
            .catch(err => { console.log(err) })

        }

    })
    .catch(err => console.log(err))

}

function removeAmount(accountName, amount) {

    const account = getAccount(accountName)

    if(!amount || amount < 0) {

        console.log(chalk.bgRed.black('An error occurred please try again later.'))
        return withdraw()

    }

    if(account.balance < amount) {

        console.log(chalk.bgRed.black('Value not available for withdraw.'))
        return withdraw()

    }

    account.balance -= amount

    fs.writeFileSync(`accounts/${accountName}.json`, JSON.stringify(account), err => {console.log(err)})

    console.log(chalk.green.bold(`Withdraw of U$${amount} successfully made on account ${accountName}`))

    operation()

}

function transfer() { 
    
    inquirer.prompt([

        {
            name: 'accountFrom',
            message: 'Please type the first account name',
        },
        {

            name: 'accountTo',
            message: 'Please type the second account name',

        }

    ])
        .then(answers => {

            const accountFrom = answers['accountFrom'];
            const accountTo = answers['accountTo'];


            if(!checkAccount(accountFrom)) {

                console.log(chalk.bgRed.yellowBright("An error occurred, please try again later (first account not found)"))
                
                return transfer();

            } else if(!checkAccount(accountTo)) {

                console.log(chalk.bgRed.yellowBright("An error occurred, please try again later (second account not found)"))

                return transfer();

            } else {

                inquirer.prompt([

                    {
                        name: 'transferenceValue',
                        message: 'Please enter the amount of the transference:'
                    },

                ])
                .then(answer => {

                    const amount = answer['transferenceValue']
                    
                    exchangeValues(accountFrom, accountTo, parseFloat(amount))

                })
                .catch(err => { console.log(err) })

            }

        })
        .catch(err => { console.log(err) })

}

function exchangeValues(accountFrom, accountTo, amount) {

    const accountOrigin = getAccount(accountFrom)
    const accountDestination = getAccount(accountTo)

    if(!amount||amount < 0) {

        console.log(chalk.bgRed.black('Desired amount is 0 or negative!'))
        return transfer()

    } else if (accountOrigin.balance < amount) {

        console.log(chalk.bgRed.black('Balance unavailable.'))
        return transfer()

    } else {
        
        accountOrigin.balance -= amount
        accountDestination.balance += amount
        
        fs.writeFileSync(`accounts/${accountFrom}.json`, JSON.stringify(accountOrigin), err => {console.log(err)})
        fs.writeFileSync(`accounts/${accountTo}.json`, JSON.stringify(accountDestination), err => {console.log(err)})
        
        console.log(chalk.green.bold(`Transfer of U$${amount} successfully made between account ${accountFrom} and account ${accountTo}`))

        operation()

    }

}