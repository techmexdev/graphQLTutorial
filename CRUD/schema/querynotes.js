/* Queries can be assigned references and passed around

e.g. 
Queries are assumed to be of the root query type but this can be optionally specified before the opening bracket

query {
  company(id: "2"){
    name
    users {
      id firstName
    }
  }
}
is the same as non-aliased query:
{
  company(id: "2"){
    name
    users {
      id firstName
    }
  }
}

is the same as aliased: 

company_users {
  company(id: "2"){
    name
    users {
      id firstName
    }
  }
}

You can run multiple queries of the same type in a single query by aliasing each one

{
  Apple: company(id: "1"){
    name
    users {
      id firstName
    }
  Google: company(id: "2"){
    name
    users {
      id firstName
    }
  }
}

returns {
  "data": {
    "Google": {
      "name": "Google",
      "users": [
        {
          "id": "40",
          "firstName": "Alex"
        },
        {
          "id": "41",
          "firstName": "Nick"
        }
      ]
    },
    "Apple": {
      "name": "Apple",
      "users": [
        {
          "id": "S1TKHzuwl",
          "firstName": "Samantha"
        }
      ]
    }
  }
}

a query fragment can be defined to make DRYER queries

{
  Apple: company(id: "1"){
    ...companyDetails
  Google: company(id: "2"){
    ...companyDetails
  }
}

fragment companyDetails on Company {
  id name description users { id firstName}
}

Mutations are denoted with mutation {
  <typeofmutation>(arg1:val1, arg2:val2){
    <fieldToExpectToReceiveBackFromServer1>
    <fieldToExpectToReceiveBackFromServer2>
    ...
  }
}
*/