package com.example.VaccinationManagementSystem.Controller;

import com.example.VaccinationManagementSystem.Service.PatientService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path="/user")
public class PatientController {

    private PatientService patientService;

    @Autowired
    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/getGoogle")
    public @ResponseBody Object validateGoogleLogin(@RequestBody String payload){
        try{
            System.out.println("Inside validateController");
            JSONObject loginPayload = new JSONObject(payload);
            String email = (String) loginPayload.get("email");
            String firstName = (String) loginPayload.get("fname");
            String lastName = (String) loginPayload.get("lname");
            String googleId = (String) loginPayload.get("gid");
            return patientService.addPatientGoogle(email, googleId, firstName, lastName);

        } catch(Exception e){
            return e.getMessage();
        }
    }

    @PostMapping("/validateOtp")
    public @ResponseBody Object validateOtp(@RequestBody String payload){
        try{
            System.out.println("Inside validateController");
            JSONObject loginPayload = new JSONObject(payload);
            String email = (String) loginPayload.get("email");
            String mrn = (String) loginPayload.get("mrn");
            String otp = (String) loginPayload.get("otp");
            return patientService.addPatientOtp(email, mrn, otp);

        } catch(Exception e){
            return e.getMessage();
        }
    }

    @PostMapping("/register")
    public @ResponseBody Object reagisterUser(@RequestBody String payload){
        try{
            JSONObject registerPayload = new JSONObject(payload);
            return patientService.addPatientDetails(registerPayload);
        }
        catch(Exception e){
            return e.getMessage();
        }
    }
}
