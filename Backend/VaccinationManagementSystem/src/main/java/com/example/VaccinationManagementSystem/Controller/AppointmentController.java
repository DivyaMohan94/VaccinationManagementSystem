package com.example.VaccinationManagementSystem.Controller;

import aj.org.objectweb.asm.TypeReference;
import com.example.VaccinationManagementSystem.Model.ErrorDetail;
import com.example.VaccinationManagementSystem.Model.ErrorResponse;
import com.example.VaccinationManagementSystem.Model.SuccessResponse;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.VaccinationManagementSystem.Service.AppointmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.criteria.CriteriaBuilder;
import java.io.DataInput;
import java.time.LocalTime;
import java.util.*;


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
    ) {
        try {
            System.out.println("Inside Appointment Controller");
            JSONObject appointment = new JSONObject(payload);
            Integer patient_id = (Integer) appointment.get("patient_id");
            Integer clinic_id = (Integer) appointment.get("clinic_id");

            String date = (String) appointment.get("appointment_date");
            String current_date = (String) appointment.get("current_date");
            JSONObject slotDetails = new JSONObject(appointment.get("slot").toString());
            LocalTime slot = LocalTime.of(
                    (int) slotDetails.get("hour"),
                    (int) slotDetails.get("minute"),
                    (int) slotDetails.get("second"));

            JSONArray vaccines = (JSONArray) appointment.get("vaccineIDs");
            List<Integer> vaccineIds = new ArrayList<>();
            if (vaccines != null) {
                int len = vaccines.length();
                for (int i = 0; i < len; i++) {
                    vaccineIds.add((Integer) vaccines.get(i));
                }
            }
            return appointmentService.makeAppointment(patient_id, clinic_id, date, slot, current_date, vaccineIds);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }

    @PostMapping("/update")
    public @ResponseBody
    Object update_Appointment(
            @RequestBody String payload
    ) {
        try {
            JSONObject appointment = new JSONObject(payload);
            Integer appointmentId = (Integer) appointment.get("appointment_id");
            Integer clinic_id = (Integer) appointment.get("clinic_id");
            String date = (String) appointment.get("appointment_date");
            JSONObject slotDetails = new JSONObject(appointment.get("slot").toString());
            LocalTime slot = LocalTime.of(
                    (int) slotDetails.get("hour"),
                    (int) slotDetails.get("minute"),
                    (int) slotDetails.get("second"));

            JSONArray vaccines = (JSONArray) appointment.get("vaccineIDs");
            List<Integer> vaccineIds = new ArrayList<>();
            if (vaccines != null) {
                int len = vaccines.length();
                for (int i = 0; i < len; i++) {
                    vaccineIds.add((Integer) vaccines.get(i));
                }
            }
            return appointmentService.updateAppointment(appointmentId, clinic_id, date, slot, vaccineIds);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }

    @DeleteMapping(path = "/cancel/{id}")
    public Object delete_Appointmnet(@PathVariable("id") Integer id) {
        try {
            appointmentService.cancelAppointment(id);
            return ResponseEntity.ok().body(new SuccessResponse("200", "Appointment with id " + id + " is canceled successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }

    @GetMapping(path = "/past")
    public Object getPastAppointments(
            @RequestParam(value = "patient_id", required = true) Integer patient_id,
            @RequestParam(value = "current_date", required = true) String current_date
    ) {
        try {
            return appointmentService.getPastAppointment(patient_id, current_date);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }

    @PostMapping(path = "/updatestatus")
    public Object changeAppointmentStatus(@RequestBody String payload) {
        try {
            System.out.println("Hitting update Status");
            System.out.println(payload);
            JSONObject appointment = new JSONObject(payload);
            String date = (String) appointment.get("current_date");
            Integer patient_id = (Integer) appointment.get("patient_id");
            appointmentService.markAppointmentCompleted(patient_id, date);
            return 1;
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }

    @GetMapping(path = "/future")
    public Object getFutureAppointments( @RequestParam(value = "patient_id", required = true) Integer patient_id,
                                         @RequestParam(value = "current_date", required = true) String current_date) {
        try {
            return appointmentService.getFutureAppointment(patient_id, current_date);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }

    @GetMapping(path = "/checkin/eligibleAppointments")
    public Object getCheckinAppointments(@RequestParam(value = "patient_id", required = true) Integer patient_id,
                                         @RequestParam(value = "current_date", required = true) String current_date) {
        try {
            return appointmentService.getCheckinAppointment(patient_id, current_date);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }

    @PostMapping(path = "/makecheckin")
    public Object checkinAppointments(@RequestBody String payload) {
        try {
            JSONObject appointment = new JSONObject(payload);
            Integer appointment_id = (Integer) appointment.get("appointment_id");
            Integer patient_id = (Integer) appointment.get("patient_id");
            return appointmentService.makeCheckinAppointment(patient_id, appointment_id);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }
    }

    @GetMapping(path = "/due")
    public @ResponseBody
    Object[] getDueAppointments(
            @RequestParam(value = "patientId") Integer patientId,
            @RequestParam(value = "currentDate") String currentDate
    ) {
        try {
            System.out.println("checking dues controller");
            System.out.println(patientId +""+ currentDate);
            Object[] dues =  appointmentService.getDueAppointments(patientId, currentDate);
            System.out.println(dues);
            return dues;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new Object [] {ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())))};
        }

    }

    @GetMapping(path = "/history")
    public @ResponseBody
    Object getDueApptHistory(
            @RequestParam(value = "patientId") Integer patientId,
            @RequestParam(value = "currentDate") String currentDate
    ) {
        try {
            System.out.println("In here");
            HashMap<String, Object> vaccineHistory = (HashMap<String, Object>) appointmentService.getHistory(patientId, currentDate);
            return vaccineHistory;
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
        }

    }

}


