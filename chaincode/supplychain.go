package main

import (
	"encoding/json"
	"fmt"
	"time"
	
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)
type IndexItem struct {
	Requestid	  string `json:"requestid"`
	Date 		  time.Time `json:"date"`
	Status		  string `json:"status"`	
}

type Request struct {
	Involvedparties   []string `json:"involvedparties"`
	Transactionlist	  []Transaction `json:"transactionlist"`
}

type Transaction struct {
	TrnsactionDetails  map[string][]string `json:"transactiondetails"`
}

type SimpleChaincode struct {
}

func (t *SimpleChaincode) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (t *SimpleChaincode) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {
	function, args := APIstub.GetFunctionAndParameters()

	switch function {
	case "newRequest":
		return t.newRequest(APIstub, args)
	case "updateRequest":
		return t.updateRequest(APIstub, args)
	 case "readTransaction":
	 	return t.readTransaction(APIstub, args)
	 case "updateTransactionList":
		return t.updateTransactionList(APIstub, args)
	case "readTransactionList":
		return t.readTransactionList(APIstub, args)
	}
	return shim.Error("Invalid Smart Contract function name.")
}

//1.newrequest   (#user,#transactionlist)
func (t *SimpleChaincode) newRequest(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering newRequest")
	var transaction Transaction
	if len(args) < 4 {
		fmt.Println("Expecting three Argument")
		return shim.Error("Expected three arguments for new Request") 	
	}

	var requestid = args[0]
	fmt.Println(requestid)

	var Date = args[1]
	fmt.Println(Date)
	
	var status =args[2]
	fmt.Println(status)
	
	var Involvedparties = args[3]
	fmt.Println(Involvedparties)

	bytes, err := APIstub.GetState(requestid)
	if err != nil {
	return shim.Error("error")
	}
   
	err = json.Unmarshal(bytes, &transaction)
	if err != nil {
		fmt.Println("unable to unmarshal user data")
		return shim.Error("error")
	}
	
	transaction.Transaction = append(transaction.Transaction, requestid)
	
	
	_, err = writeIntoBlockchain(requestid, transaction, APIstub)
	if err != nil {
		fmt.Println("Could not store request to transaction", err)
		//return nil, err
		return shim.Error("error")
	}

	fmt.Println("Successfully stored the request")
	return shim.Success(nil)

}

//2.updateRequest   (#doc,#user, #org)  Invoke
func (t *SimpleChaincode) updateRequest(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering updateRequest")
	var usertransaction UserTransaction
	if len(args) < 2 {
		fmt.Println("Expecting two Argument")
		return shim.Error("Expected two arguments for new Request")
	}

	var requestno = args[0]
	fmt.Println(requestno)
	var transaction =args[1]
	fmt.Println(transaction)
	
	usertransactionbytes, err := APIstub.GetState(requestno)
	if err != nil {
		fmt.Println("could not fetch user", err)
		return shim.Error("error")

	}
	err = json.Unmarshal(usertransactionbytes, &usertransaction)
	if err != nil {
		fmt.Println("unable to unmarshal user data")
		//return nil, err
		return shim.Error("error")
	}
	if !contains(usertransaction.Owns, transactionlist) {
		fmt.Println("list doesnt exists")
		// return nil, err
		return shim.Error("error")
	}

	_, err = writeIntoBlockchain(transactionlist, usertransaction, APIstub)
	if err != nil {
		fmt.Println("Could not store updated request", err)
		// return nil, err
		return shim.Error("error")
	}

	fmt.Println("Successfully stored updated request")
	return shim.Success(nil)
}

//3. readRequest    (#user) Query
func (t *SimpleChaincode) readTransaction(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering read request")

	if len(args) < 1 {
		fmt.Println("Invalid number of arguments")
		// return nil, errors.New("Missing userid")
		return shim.Error("Expecting one arguments for fetching requests ")
	}

	
	bytes, err := APIstub.GetState("getTransaction")

	if err != nil {
		fmt.Println("Could not fetch users request list", err)
		// return nil, err
		return shim.Error("error")
	}
	
	//return idasbytes, nil
	return shim.Success(bytes)
}
//4.readtransactionList  (#user) Query
func (t *SimpleChaincode) readTransactionList(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering read Transaction")

	if len(args) < 1 {
		fmt.Println("Invalid number of arguments")
		// return nil, errors.New("Missing userid")
		return shim.Error("Expecting one arguments for fetching requests i.e requestno")
	}
	bytes, err := APIstub.GetState("getTransactionlist")
	if err != nil {
		fmt.Println("Could not fetch  all users transactions list", err)
		// return nil, err
		return shim.Error("error")
	}
	
	//return idasbytes, nil
	return shim.Success(bytes)
}
//5.updatetransactionList  (#user) Query

func (t *SimpleChaincode) updateTransactionList(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering update Transaction")

	if len(args) < 2 {
		fmt.Println("Invalid number of arguments")
		// return nil, errors.New("Missing userid")
		return shim.Error(errors.New("Expecting two arguments for updating transactionList i.e requestno & transactionList"))
	}

	var requestno = args[0]

	var transactionlist = args[1]

	bytes, err := stub.GetState(getTransactionlist)
	if err != nil {
		fmt.Println("Could not fetch  all users transactions list", err)
		// return nil, err
		return shim.Error(err)
	}
	
	//return idasbytes, nil
	return shim.Success(bytes)
}

func main() {
	err := shim.Start(new(SimpleChaincode))

	if err != nil {
		fmt.Println("Could not start SimpleChaincode")
	} else {
		fmt.Println("SimpleChaincode successfully started")
	}
}
func contains(slice []string, item string) bool {
	set := make(map[string]struct{}, len(slice))
	for _, s := range slice {
		set[s] = struct{}{}
	}

	_, ok := set[item]
	return ok
}
func makeTimestamp() string {
	t := time.Now()

	return t.Format(("2006-01-02T15:04:05.999999-07:00"))
	//return time.Now().UnixNano() / (int64(time.Millisecond)/int64(time.Nanosecond))
}

//------------- reusable methods -------------------
func writeIntoBlockchain(key string, value UserTransaction, APIstub shim.ChaincodeStubInterface) ([]byte, error) {
	bytes, err := json.Marshal(&value)
	if err != nil {
		fmt.Println("Could not marshal info object", err)
		return nil, err
		}

	err = APIstub.PutState(key, bytes)
	if err != nil {
		fmt.Println("Could not save updated transactionlist ", err)
		return nil, err
		}

		return nil, nil
	}

func readFromBlockchain(key string, APIstub shim.ChaincodeStubInterface) (UserTransaction, error) {
	usertransactionbytes, err := APIstub.GetState(key)
	var usertransaction UserTransaction
	
	if err != nil {
		fmt.Println("could not fetch user", err)
		return usertransaction, err
		}

	err = json.Unmarshal(usertransactionbytes, &usertransaction)
	if err != nil {
		fmt.Println("Unable to marshal data", err)
		return usertransaction, err
		}

		return usertransaction , nil
	}
