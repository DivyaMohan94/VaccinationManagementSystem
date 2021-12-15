package com.example.VaccinationManagementSystem.Controller;

import com.example.VaccinationManagementSystem.Model.*;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.VaccinationManagementSystem.Service.ClinicService;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalTime;
import java.util.Date;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping(path = "/clinic")
public class ClinicController {
    private final ClinicService clinicService;

    @Autowired
    public ClinicController(ClinicService clinicService) {
        this.clinicService = clinicService;
    }

    @PostMapping()
    public @ResponseBody
    Object createClinic(@RequestBody String payload) {
        try {
            JSONObject clinic = new JSONObject(payload);
            JSONObject address = new JSONObject(clinic.get("address").toString());
            JSONObject startTime = new JSONObject(clinic.get("startTime").toString());
            JSONObject endTime = new JSONObject(clinic.get("endTime").toString());

            Address add = new Address(
                    (String) address.get("street"),
                    (Integer) address.get("number"),
                    (String) address.get("city"),
                    (String) address.get("state"),
                    (String) address.get("zipcode"));

            LocalTime start = LocalTime.of(
                    (int) startTime.get("hour"),
                    (int) startTime.get("minute"),
                    (int) startTime.get("second"));
            LocalTime end = LocalTime.of(
                    (int) endTime.get("hour"),
                    (int) endTime.get("minute"),
                    (int) endTime.get("second"));

            return clinicService.createClinic(
                    (String) clinic.get("name"),
                    add,
                    //(String) clinic.get("businessHours"),
                    (Integer) clinic.get("numberOfPhysicians"),
                    start,
                    end);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }

    @GetMapping(path="/slots")
    public @ResponseBody
    List<LocalTime> getAllClinicSlots(){
        return clinicService.getAllSlots();
    }

    @GetMapping(path="/appointments")
    public @ResponseBody
    List<Clinic> getAllClinicsWithSpecificSlot(
            @RequestParam(value = "selectedDate") String selectedDate,
            @RequestParam("specificSlot") String specificSlot) throws ParseException {
        System.out.println("inside get---"+ selectedDate);
        Date selectedate = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        selectedate = dateFormat.parse(selectedDate);
        System.out.println("inside get---"+ specificSlot);
        String[] slotDetails = specificSlot.split(":");
        LocalTime selectedSlot = LocalTime.of(
                Integer.valueOf(slotDetails[0]),
                Integer.valueOf(slotDetails[1]),
                Integer.valueOf(slotDetails[2]));
        System.out.println("inside get selectedSlot---"+ selectedSlot);
        return clinicService.getAllClinicsWithSpecificSlot(selectedate, selectedSlot);
    }

    @GetMapping(path="/all")
    public @ResponseBody
    List<Clinic> getAllClinics(){
        return clinicService.getAllClinics();
    }
//    @PutMapping(path = "{clinicId}")
//    public @ResponseBody Object updatePassenger(@PathVariable("clinicId") Integer clinicId,
//                                                @RequestParam(value = "name", required = false) String name,
//                                                @RequestParam(value = "address", required = false) Address address,
//                                                @RequestParam(value = "businessHour", required = false) String businessHour,
//                                                @RequestParam(value = "numberOfPhysicians
//                                                ", required = false) Integer numberOfPhysicians

//    ){
//        try{
//            return clinicService.updateClinic(clinicId, name, address, businessHour, numberOfPhysicians
//            );
//        } catch(Exception e){
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(new ErrorDetail("404", e.getMessage())));
//        }
//    }
//
//    @DeleteMapping(path = "{clinicId}")
//    public @ResponseBody
//    Object deleteClinic(@PathVariable("clinicId") Integer clinicId) {
//        try {
//             clinicService.deleteClinic(clinicId);
//            return ResponseEntity.ok().body(new SuccessResponse("200", "Clinic with id "+clinicId+" is deleted successfully"));
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
//        }
//    }
}
