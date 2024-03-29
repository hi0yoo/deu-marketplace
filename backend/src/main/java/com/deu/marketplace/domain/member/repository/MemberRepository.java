package com.deu.marketplace.domain.member.repository;

import com.deu.marketplace.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByOauthId(String oauthId);
    Optional<Member> findByEmail(String email);
    List<Member> findByNicknameContains(String nickname);
}
