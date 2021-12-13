package com.example.VaccinationManagementSystem.Controller;

import com.example.VaccinationManagementSystem.Model.ErrorDetail;
import com.example.VaccinationManagementSystem.Model.ErrorResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

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
            String date = (String) appointment.get("appointment_date");
            String current_date = (String) appointment.get("current_date");
            JSONObject slotDetails = new JSONObject(appointment.get("slot").toString());
            LocalTime slot = LocalTime.of(
                    (int) slotDetails.get("hour"),
                    (int) slotDetails.get("minute"),
                    (int) slotDetails.get("second"));

            JSONArray vaccines = (JSONArray)appointment.get("vaccineIDs");
            List<Integer> vaccineIds = new ArrayList<>();
            if (vaccines != null) {
                int len = vaccines.length();
                for (int i=0;i<len;i++){
                    vaccineIds.add((Integer) vaccines.get(i));
                }
            }
            //List<String> vaccines = (List<String>) appointment.get("vaccine");
            return appointmentService.makeAppointment(patient_id,clinic_id,date,slot,current_date,vaccineIds);

        } catch(Exception e){
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }
}
