# wallet Api
  # Create Wallet:
    Method: POST
    End point: /setup
    Request body : name,  balance
    Response status : 200
    Response body : { data: { id, balance, name, transactionId, message, date  } }
  # Add Transaction
    Method: POST
    End point: /transaction/:walletId
    Request params: wallettId
    Request body: description, amount
    Response status : 200
    Response body : { data: { balance, transactionId, message } }
  # Get Transactions
    Method: GET
    End point: /transactions?walletId&sort&order&limit&sort
    Response body : { data: { transactionId, walletId, description, amount, balance, type, date } }
    

# Wallet App
    The app will look for wallet stored it localstorage, if the item is present transaction screen will be shown else option to add a new wallet will be shown. There is list transaction page where all the transactions related to wallet in localstorage will be displayed. The transaction list has paginated data, option to sort.
