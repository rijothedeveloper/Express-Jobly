const { sqlForPartialUpdate } = require("../helpers/sql");

describe ("test for sqlForPartialUpdate", ()=>{
    test("create set colum and valuearray", ()=> {
        const{setCols, values} = sqlForPartialUpdate({"lastName":"george"}, {
            firstName: "first_name",
            lastName: "last_name",
            isAdmin: "is_admin",
          })

        expect(values).toEqual(["george"])
    })
})