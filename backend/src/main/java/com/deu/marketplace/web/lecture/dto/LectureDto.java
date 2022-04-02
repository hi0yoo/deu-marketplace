package com.deu.marketplace.web.lecture.dto;

import com.deu.marketplace.domain.lecture.entity.Lecture;
import lombok.Builder;
import lombok.Getter;

@Getter
public class LectureDto {
    private Long id;
    private String lectureName;
    private String professorName;

    @Builder
    public LectureDto(Lecture lecture) {
        this.id = lecture.getId();
        this.lectureName = lecture.getLectureName();
        this.professorName = lecture.getProfessorName();
    }
}