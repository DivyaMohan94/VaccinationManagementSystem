package com.example.VaccinationManagementSystem.Controller;

import com.example.VaccinationManagementSystem.Model.ErrorDetail;
import com.example.VaccinationManagementSystem.Model.ErrorResponse;
import com.example.VaccinationManagementSystem.Service.ReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/reports")
public class ReportsController {


    private final ReportsService reportsService;

    @Autowired
    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping(path = "/perPatientReport")
    public @ResponseBody
    Object getPerPatientReport(
            @RequestParam(value = "patientId", required = true) String patientId,
            @RequestParam(value = "fromDate", required = true) String fromDate,
            @RequestParam(value = "toDate", required = true) String toDate) {
        try {
            return reportsService.getPerPatientReport(patientId,fromDate,toDate);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }


    @GetMapping(path = "/systemReport")
    public @ResponseBody
    Object getSystemReport(
            @RequestParam(value = "clinicId", required = true) String clinicId,
            @RequestParam(value = "fromDate", required = true) String fromDate,
            @RequestParam(value = "toDate", required = true) String toDate) {
        try {
            return reportsService.getSystemReport(clinicId,fromDate,toDate);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(new ErrorDetail("400", e.getMessage())));
        }
    }
}
