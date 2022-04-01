package com.mint.backend.service;

import com.mint.backend.domain.*;
import com.mint.backend.dto.RequestConcertDto;
import com.mint.backend.dto.ResponseFindAllDto;
import com.mint.backend.dto.ResponseFindOneDto;
import com.mint.backend.dto.ResponseSearchDto;
import com.mint.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;


@Service
@RequiredArgsConstructor
public class ConcertService {

    private final ConcertRepository concertRepository;
    private final ArtistRepository artistRepository;
    private final TimesRepository timesRepository;
    private final SeatRepository seatRepository;
    private final SectionRepository sectionRepository;
    private final CidsRepository cidsRepository;

    /**
     * 콘서트 목록 조회
     *
     * @param status
     * @return
     */
    @Transactional(readOnly = true)
    public List<ResponseFindAllDto> getConcertList(int status) {
//        return new ResponseFindAllDto()
//                .toDTO(concertRepository.findConcert(status));
        List<Concert> concert = concertRepository.findConcert(status);
        List<ResponseFindAllDto> list = new ArrayList<>();
        for (Concert con : concert) {
            list.add(ResponseFindAllDto.builder()
                    .id(con.getId())
                    .title(con.getTitle())
                    .thumnail(con.getImage().getThumbnailUrl())
                    .poster(con.getImage().getPosterUrl())
                    .startDate(timesRepository.findFirstByConcert_IdOrderByDateAsc(con.getId()).getDate())
                    .endDate(timesRepository.findFirstByConcert_IdOrderByDateDesc(con.getId()).getDate())
                    .artist(con.getArtist())
                    .build());
        }
        return list;
    }


    /**
     * 콘서트 상세정보
     *
     * @param concertId
     * @return
     */
    @Transactional(readOnly = true)
    public ResponseFindOneDto getConcertDetail(Long concertId) {
        return new ResponseFindOneDto()
                .toDTO(concertRepository
                        .findById(concertId)
                        .orElseThrow(RuntimeException::new));
    }


    /**
     * 콘서트 검색
     *
     * @param keyword
     * @return
     */
    @Transactional(readOnly = true)
    public List<ResponseSearchDto> search(String keyword) {
        List<Concert> concert = concertRepository.searchConcert(keyword);
        List<ResponseSearchDto> list = new ArrayList<>();
        for (Concert con : concert) {
            list.add(ResponseSearchDto.builder()
                    .id(con.getId())
                    .title(con.getTitle())
                    .ThumnailUrl(con.getImage().getThumbnailUrl())
                    .startDate(timesRepository.findFirstByConcert_IdOrderByDateAsc(con.getId()).getDate())
                    .endDate(timesRepository.findFirstByConcert_IdOrderByDateDesc(con.getId()).getDate())
                    .artists(con.getArtist())
                    .build());
        }
        return list;
    }


    /**
     * 콘서트 등록
     *
     * @param poster
     * @param thumnail
     * @param description
     * @param seats
     * @param requestConcertDto
     * @return
     * @throws IOException
     *
     * @modified 박창현
     * 이미지 저장 폴더 명을 컨트랙트 주소를 잘라 저장하게 변경했습니다
     * 106번, 108번 줄
     */
    @Transactional
    public boolean create(MultipartFile poster,
                          MultipartFile thumnail,
                          MultipartFile description,
                          MultipartFile seats,
                          RequestConcertDto requestConcertDto) throws IOException {
        //실제저장경로
        String realPath = System.getProperty("user.dir") + File.separator + "src" + File.separator + "main" +
                File.separator + "resources" + File.separator + "image" + File.separator +
                requestConcertDto.getContractAddress().substring(0, 15);
        //DB저장경로
        String Path = "files" +File.separator + requestConcertDto.getContractAddress().substring(0, 15)+File.separator;

        //이미지 저장
        poster.transferTo(new File(realPath, poster.getOriginalFilename()));
        thumnail.transferTo(new File(realPath, thumnail.getOriginalFilename()));
        description.transferTo(new File(realPath, description.getOriginalFilename()));
        seats.transferTo(new File(realPath, seats.getOriginalFilename()));
        try {
            Image image = Image.builder()
                    .thumbnailUrl(Path + thumnail.getOriginalFilename())
                    .descriptionUrl(Path + description.getOriginalFilename())
                    .posterUrl(Path + poster.getOriginalFilename())
                    .sectionUrl(Path + seats.getOriginalFilename())
                    .build();

            //콘서트등록
            Concert concert = Concert.builder()
                    .title(requestConcertDto.getTitle())
                    .place(requestConcertDto.getPlace())
                    .contractAddress(requestConcertDto.getContractAddress())
                    .saleContractAddress(requestConcertDto.getSaleContractAddress())
                    .price(requestConcertDto.getPrice())
                    .status(requestConcertDto.getStatus())
                    .image(image)
                    .build();

            concertRepository.save(concert);
            //가수등록
            Arrays.stream(requestConcertDto.getSinger()).forEach(s -> artistRepository.save(Artist.builder()
                    .name(s)
                    .concert(concert)
                    .build()));

            //포토카드 등록
            Arrays.stream(requestConcertDto.getCids()).forEach(s -> cidsRepository.save(Cids.builder()
                    .cid(s)
                    .concert(concert)
                    .build()));

            //시간등록
            int turn = requestConcertDto.getTime();
            for (int i = 0; i < turn; i++) {
                Times time = Times.builder()
                        .date(requestConcertDto.getTimeTable()[i])
                        .concert(concert)
                        .build();
                timesRepository.save(time);


                //섹션등록
                Map<String, Integer> map = requestConcertDto.getSection();

                for (String s : map.keySet()) {
                    Section section = Section.builder()
                            .name(s)
                            .times(time)
                            .build();
                    sectionRepository.save(section);

                    //자리등록
                    for (int j = 0; j < map.get(s); j++) {
                        Seat seat = Seat.builder()
                                .name(s + Integer.toString(j))
                                .section(section)
                                .build();
                        seatRepository.save(seat);


                    }


                }

            }

        } catch (Exception e) {
            return false;
        }
        return true;
    }

    //콘서트 수정
    public Concert update() {
        //to do
        return new Concert();
    }

    /**
     * 콘서트 삭제
     *
     * @param ConcertId
     * @return
     */
    @Transactional
    public boolean delete(Long ConcertId) {
        try {
            concertRepository.deleteById(ConcertId);
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
