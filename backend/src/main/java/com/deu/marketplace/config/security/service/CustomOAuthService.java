package com.deu.marketplace.config.security.service;

import com.deu.marketplace.config.security.dto.OAuthAttributes;
import com.deu.marketplace.config.security.dto.OauthUserDto;
import com.deu.marketplace.config.security.dto.UserPrincipal;
import com.deu.marketplace.domain.member.entity.Member;
import com.deu.marketplace.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomOAuthService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final MemberRepository memberRepository;

    // back
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration()
                .getRegistrationId(); // OAuth 서비스 이름(ex. github, naver, google)
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName(); // OAuth 로그인 시 키(pk) 값
        Map<String, Object> attributes = oAuth2User.getAttributes(); // OAuth 서비스의 유저 정보들
        OauthUserDto userDto = OAuthAttributes.extract(registrationId, attributes);
        // registrationId에 따라 유저 정보를 통해 공통된 UserProfile 객체로 만들어 줌

        Member member = saveOrUpdate(userDto);
        return UserPrincipal.byMemberBuilder()
                .member(member)
                .attributes(attributes)
                .build();
//        return new DefaultOAuth2User(
//                Collections.singleton(new SimpleGrantedAuthority(member.getRoleKey())),
//                attributes,
//                userNameAttributeName);
    }

//    // front
//    public LoginResponse login(String providerName, String code) {
//
//    }

    private Member saveOrUpdate(OauthUserDto userDto) {
        Member member = memberRepository.findByOauthId(userDto.getOauthId())
                .map(m -> m.updateInfo(userDto.getName(), userDto.getEmail()))
                .orElse(userDto.toMemberEntity());
        return memberRepository.save(member);
    }
}
