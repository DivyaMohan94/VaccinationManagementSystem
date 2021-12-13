/*
package com.example.VaccinationManagementSystem.Controller;

import com.example.VaccinationManagementSystem.Model.ErrorDetail;
import com.example.VaccinationManagementSystem.Model.ErrorResponse;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path="/user")
public class UserController {
    @PostMapping("/getGoogle")
    public @ResponseBody Object validateGoogleLogin(@RequestBody String payload){
        try{
            System.out.println("Inside validateController");
            JSONObject loginPayload = new JSONObject(payload);
            String email = (String) loginPayload.get("email");
            String firstName = (String) loginPayload.get("fname");
            String lastName = (String) loginPayload.get("lname");
            String googleId = (String) loginPayload.get("gid");
            return "true";
        } catch(Exception e){
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }
    @GetMapping("/allokay")
    public String allokay(){
        return " All Okay";
    }
}
*/
