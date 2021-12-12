package com.example.VaccinationManagementSystem.Controller;

import com.example.VaccinationManagementSystem.Model.ErrorDetail;
import com.example.VaccinationManagementSystem.Model.ErrorResponse;
import com.example.VaccinationManagementSystem.Model.SuccessResponse;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.VaccinationManagementSystem.Service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;


@RestController
@RequestMapping(path="/appointment")
public class AppointmentController {

    private final AppointmentService appointmentService;


    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }


    @PostMapping("/create")
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
            String current_date = (String) appointment.get("current_date");
            List<String> vaccines = (List) appointment.get("vaccine");
            JSONObject slotDetails = new JSONObject(appointment.get("slot").toString());
            LocalTime slot = LocalTime.of(
                    (int) slotDetails.get("hour"),
                    (int) slotDetails.get("minute"),
                    (int) slotDetails.get("second"));
            return appointmentService.makeAppointment(patient_id,clinic_id,date,slot,vaccines,current_date);

        } catch(Exception e){
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }
    @PostMapping("/update")
    public @ResponseBody
    Object update_Appointment(
            @RequestBody String payload
    ){
        try{
            System.out.println("Inside update Appointment Controller");
            JSONObject appointment = new JSONObject(payload);
            Integer appointmentId = (Integer) appointment.get("appointment_id");
            Integer clinic_id = (Integer) appointment.get("clinic_id");
            String date = (String) appointment.get("date");
            List<String> vaccines = (List) appointment.get("vaccine");
            JSONObject slotDetails = new JSONObject(appointment.get("slot").toString());
            LocalTime slot = LocalTime.of(
                    (int) slotDetails.get("hour"),
                    (int) slotDetails.get("minute"),
                    (int) slotDetails.get("second"));
            return appointmentService.updateAppointment(appointmentId,clinic_id,date,slot,vaccines);

        } catch(Exception e){
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }

    @DeleteMapping(path = "{id}")
    public Object delete_Appointmnet(@PathVariable("id") Integer id){
        try{
            appointmentService.cancelAppointment(id);
            return ResponseEntity.ok().body(new SuccessResponse("200", "Appointment with id "+id+" is deleted successfully"));
        } catch(Exception e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }

}


