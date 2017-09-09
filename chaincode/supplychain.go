package main

import (
	"encoding/json"
	"fmt"
	"time"
	
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type User struct {
	Owns []string `json:"owns"`
	//SharedwithMe []DocumentInfo `json:"sharedwithme"`
	Requestno		   map[string][]string `json:requestno`
	Involvedparties    map[string][]string `json:"involvedparties"`
	Transactionlist    map[string][]string `json:"transactionlist"`
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
	// case "readRequest":
	// 	return t.readRequest(APIstub, args)
	// case "updateTransaction":
	// 	return t.updateTransaction(APIstub, args)
	case "readTransaction":
		return t.readTransaction(APIstub, args)
	}
	return shim.Error("Invalid Smart Contract function name.")
}

//1.newrequest   (#user,#transactionlist)
func (t *SimpleChaincode) newRequest(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering newRequest")
	var user User
	if len(args) < 3 {
		fmt.Println("Expecting three Argument")
		//return nil, errors.New("Expected at least two arguments for adding a document")
		 return shim.Error("Expected three arguments for new Request") 	
	}

	var requestno = args[0]
	fmt.Println(requestno)
	var involvedparties = args[1]
	fmt.Println(involvedparties)
	var transactionlist =args[2]
	fmt.Println(transactionlist)
	
	bytes, err := APIstub.GetState(requestno)
	if err != nil {
	//	return nil, err
	return shim.Error("error")
	}

	err = json.Unmarshal(bytes, &user)
	if err != nil {
		fmt.Println("unable to unmarshal user data")
		//return nil, err
		return shim.Error("error")
	}

	user.Owns = append(user.Owns, involvedparties)
	user.Owns = append(user.Owns, transactionlist)
	
	_, err = writeIntoBlockchain(requestno, user, APIstub)
	if err != nil {
		fmt.Println("Could not store request to user", err)
		//return nil, err
		return shim.Error("error")
	}

	fmt.Println("Successfully stored the request")
	return shim.Success(nil)

}

//2.updateRequest   (#doc,#user, #org)  Invoke
func (t *SimpleChaincode) updateRequest(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering updateRequest")
	var user User
	if len(args) < 2 {
		fmt.Println("Expecting two Argument")
		return shim.Error("Expected two arguments for new Request")
	}

	var requestno = args[0]
	fmt.Println(requestno)
	var transactionlist =args[1]
	fmt.Println(transactionlist)
	
	userbytes, err := APIstub.GetState(requestno)
	if err != nil {
		fmt.Println("could not fetch user", err)
		//return nil, err
		return shim.Error("error")

	}
	err = json.Unmarshal(userbytes, &user)
	if err != nil {
		fmt.Println("unable to unmarshal user data")
		//return nil, err
		return shim.Error("error")
	}
	if !contains(user.Owns, transactionlist) {
		fmt.Println("list doesnt exists")
		// return nil, err
		return shim.Error("error")
	}

	_, err = writeIntoBlockchain(transactionlist, user, APIstub)
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
/*func (t *SimpleChaincode) updateTransactionList(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	fmt.Println("Entering update Transaction")

	if len(args) < 2 {
		fmt.Println("Invalid number of arguments")
		// return nil, errors.New("Missing userid")
		return shim.Error(errors.New("Expecting two arguments for updating transactionList i.e requestno & transactionList"))
	}

	var requestno = args[0]

	var transactionlist = args[1]

	bytes, err := stub.GetState("getTransactionlist")
	if err != nil {
		fmt.Println("Could not fetch  all users transactions list", err)
		// return nil, err
		return shim.Error(err)
	}
	
	//return idasbytes, nil
	return shim.Success(bytes)
}*/

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
func writeIntoBlockchain(key string, value User, APIstub shim.ChaincodeStubInterface) ([]byte, error) {
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

func readFromBlockchain(key string, APIstub shim.ChaincodeStubInterface) (User, error) {
	userbytes, err := APIstub.GetState(key)
	var user User
	
	if err != nil {
		fmt.Println("could not fetch user", err)
		return user, err
		}

	err = json.Unmarshal(userbytes, &user)
	if err != nil {
		fmt.Println("Unable to marshal data", err)
		return user, err
		}

		return user , nil
	}
