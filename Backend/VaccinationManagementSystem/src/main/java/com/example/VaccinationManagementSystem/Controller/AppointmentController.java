package com.example.VaccinationManagementSystem.Controller;

import com.example.VaccinationManagementSystem.Model.ErrorDetail;
import com.example.VaccinationManagementSystem.Model.ErrorResponse;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.VaccinationManagementSystem.Service.AppointmentService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(path="/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;


    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }


    @PostMapping()
    public @ResponseBody
    Object make_appointment(
            @RequestBody String payload
    ){
        try{
            System.out.println("Inside Appointment Controller");
            JSONObject appointment = new JSONObject(payload);
            Integer patient_id = (Integer) appointment.get("patient_id");
            Integer clinic_id = (Integer) appointment.get("clinic_id");
            String date = (String) appointment.get("date");
            String slot = appointment.get("slot").toString();
            return appointmentService.makeAppointment(patient_id,clinic_id,date,slot);

        } catch(Exception e){
            System.out.println("is it coming here at all");
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }


}


