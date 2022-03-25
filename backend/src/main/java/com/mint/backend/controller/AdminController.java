package com.mint.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * @packageName : com.mint.backend.controller
 * @fileName : adminController
 * @date : 2022-03-24
 * @language : JAVA
 * @classification :
 * @time_limit : 2sec
 * @required_time : 00:40 ~ 01:22
 * @submissions : 1
 * @description :
 **/
@RestController
@RequestMapping("/api")
public class AdminController {

    @PostMapping
    public ResponseEntity create(@RequestParam int status){
        //to do
        return ResponseEntity.ok().body("콘서트 정보 등록");
    }

    @PutMapping("/concert")
    public ResponseEntity update(@PathVariable Long concertId){
        //to do
        return ResponseEntity.ok().body("콘서트 정보 수정");
    }

    @DeleteMapping("/concert")
    public ResponseEntity delete(@RequestParam Long concertId){
        //to do
        return ResponseEntity.ok().body("콘서트 정보 삭제");
    }

    @PostMapping("/concert/admin")
    public ResponseEntity existAuth(@RequestParam String keyword){
        //to do
        return ResponseEntity.ok().body("관리자 권한 확인");
    }
}