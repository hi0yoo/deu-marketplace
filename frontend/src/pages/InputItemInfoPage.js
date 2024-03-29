import React, { useState } from "react";
import './InputItemInfoPage.scss';
import HeaderContainer from "../containers/HeaderContainer";

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import SellIcon from '@mui/icons-material/Sell';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArticleIcon from '@mui/icons-material/Article';
import { Backdrop, CircularProgress, Fade, FormHelperText, InputAdornment, List, ListItem, ListItemText, OutlinedInput, Snackbar, Typography } from '../../node_modules/@material-ui/core/index';
import { UseApi } from '../api/UseApi';
import { getItemCategory, getLectures, getPostCategory, saveItem, saveItemImgs, savePost, savePostImgs, updateItem, updateItemImgs, updatePost, updatePostImgs } from '../api/Api';
import { Link } from '../../node_modules/react-router-dom/index';
import Modal from '@mui/material/Modal';
import { ListItemButton, ToggleButton, ToggleButtonGroup } from "../../node_modules/@mui/material/index";
import { FixedSizeList } from 'react-window';
import { Delete } from "../../node_modules/@material-ui/icons/index";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useLocation, useNavigate } from "../../node_modules/react-router/index";
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
    const { onChange, ...other } = props;
  
    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        thousandSeparator
        isNumericString
        // prefix="$"
      />
    );
  });
  
  NumberFormatCustom.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

const InputItemInfoPage = ({token, setToken}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [itemId, setItemId] = React.useState(location.state?location.state.targetId:0);
    const [imgs, setImgs] = React.useState(location.state?location.state.imgList.map(file => file.img):[]);
    const [origImgs, setOrigImgs] = React.useState(location.state?location.state.imgList:[]);
    const [delImgs, setDelImgs] = React.useState([]);
    // const [files, setFiles] = React.useState(imgs.length==0?[]:imgs.map(img => convertURLtoFile(img)));
    const [files, setFiles] = React.useState([]);
    const [classification, setClassification] = React.useState(location.state?location.state.classification:'sell');
    const [selectCategorName, setSelectCategoryName] = React.useState(location.state?location.state.category.categoryName:'');
    // const [selectCategory, setSelectCategory] = React.useState(location.state?location.state.category:{});
    const [itemCategory, setItemCategory] = React.useState([]);
    const [postCategory, setPostCategory] = React.useState([]);
    const [lecture, setLecture] = React.useState(location.state?(location.state.lecture?location.state.lecture:{
        lectureId: '',
        lectureName: '',
        professorName: ''
    })
        :{
            lectureId: '',
            lectureName: '',
            professorName: ''
        }
    );
    const [bookState, setBookState] = React.useState(location.state?location.state.bookState
        :{
            writeState: '',
            surfaceState: '',
            regularPrice: ''
        }
    );
    const [price, setPrice] = React.useState(location.state?location.state.price:'');
    const [title, setTitle] = useState(location.state?location.state.title:'');
    // const [selected, setSelected] = useState("카테고리");
    const [description, setDescription] = useState(location.state?location.state.description:'');
    const [contents, setContents] = useState(location.state?location.state.contents:'');
    const [loading, setLoading] = React.useState(false);

    const [titleFieldError, setTitleFieldError] = React.useState(false);
    const [categoryFieldError, setCategoryFieldError] = React.useState(false);
    const [priceFieldError, setPriceFieldError] = React.useState(false);
    const [descriptionFieldError, setDescriptionFieldError] = React.useState(false);
    const [lectureFieldError, setLectureFieldError] = React.useState(false);
    const [writeStateFieldError, setWriteStateFieldError] = React.useState(false);
    const [surfaceStateFieldError, setSurfaceStateFieldError] = React.useState(false);
    const [regularPriceFieldError, setRegularPriceFieldError] = React.useState(false);
    const [postContentFieldError, setPostContentFieldError] = React.useState(false);
    const [priceFieldWarn, setPriceFieldWarn] = React.useState(false);

    const setAllFieldError = (value) => {
        setTitleFieldError(value);
        setCategoryFieldError(value);
        setPriceFieldError(value);
        setDescriptionFieldError(value);
        setLectureFieldError(value);
        setWriteStateFieldError(value);
        setSurfaceStateFieldError(value);
        setRegularPriceFieldError(value);
        setPostContentFieldError(value);
    };

    function handleClick() {
      setLoading(false);
    };
    const [alertOpen, setAlertOpen] = React.useState({
        open: false,
        Transition: Fade,
      });
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [modalLectureName, setModalLectureName] = useState('');
    const [modalProfessorName, setModalProfessorName] = useState('');
    const onModalLectureNameHandleChange = (e) => {
        setModalLectureName(e.target.value);
    };
    const onModalProfessorNameHandleChange = (e) => {
        setModalProfessorName(e.target.value);
    };
    const [lectureList, setLectureList] = useState([]);
    const [lecturePage, setLecturePage] = useState(0);
    const [isLastLecturePage, setIsLastLecturePage] = useState(false);
    const [isFirstLecturePage, setIsFirstLecturePage] = useState(false);


    const addImg = (e) => {
        let nowSelectImgList = Array.from(e.target.files);
        console.log(nowSelectImgList);
        console.log(imgs.length + nowSelectImgList.length);
        if (imgs.length + nowSelectImgList.length > 10) {
            setAlertOpen({
                open: true,
                Transition: Fade,
            });
            const cutIdx = 10 - imgs.length;
            console.log(Array.from(nowSelectImgList).slice(0,cutIdx));
            nowSelectImgList = Array.from(nowSelectImgList).slice(0,cutIdx);
            console.log(nowSelectImgList);
        }
        setFiles([...files, ...nowSelectImgList]);
        const nowImgUrlList = [...imgs];
        for (let i = 0; i<nowSelectImgList.length; i++) {
            const nowImgUrl = URL.createObjectURL(nowSelectImgList[i]);
            nowImgUrlList.push(nowImgUrl);
        }
        setImgs(nowImgUrlList);
        console.log(nowImgUrlList);
        console.log(files);
    };

    // X버튼 클릭 시 이미지 삭제
    const handleDeleteImage = (id) => {
        console.log(id);
        setImgs(imgs.filter((_, index) => index !== id));
        if (origImgs.length-1 >= id) {
            setOrigImgs(origImgs.filter((_,index) => index !== id));
            setDelImgs([...delImgs, origImgs[id]]);
        } else {
            setFiles(files.filter((_, index) => index !== id-origImgs.length));
        }
    };

    const alertOpenHandleClose = () => {
        setAlertOpen({
            ...alertOpen,
            open: false,
        });
    };

    const imgPlusButton = () => {
        return (
            <>
                <div className="div_img" key={0}>
                    <label
                    htmlFor="input_file"
                    className="lb_inputFile"
                    onChange={addImg}
                    >
                        <AddPhotoAlternateIcon className="icon_img" fontSize='inherit' />
                        <div className="txt_plus">이미지 등록({imgs.length}/10)</div>
                        <input 
                            type={"file"}
                            multiple="muliple"
                            id="input_file"
                            style={{display: 'none'}}
                            accept=".jpg,.jpeg,.png"
                        />
                    </label>
                </div>
            </>
        );
    };

    const renderImgs = () => {
        return (
            <>
            <div>
                <div className="div_imgList">
                    {imgs.length>=10?null:(imgPlusButton())}
                    {imgs.map((image, id) => (
                        <div className="div_img" key={id+1}>
                            <img src={image} alt={`${image}-${id+1}`} onClick={() => handleDeleteImage(id)}/>
                            <div className="div_imgSeq" onClick={() => handleDeleteImage(id)}>{id+1}</div>
                        </div>
                    ))}
                    {/* {imgs.length>=10?null:(imgPlusButton())} */}
                </div>
                <Snackbar 
                    open={alertOpen.open}
                    onClose={alertOpenHandleClose}
                    TransitionComponent={alertOpen.Transition}
                    message="이미지는 최대 10개 까지만 업로드 가능합니다."
                    key={alertOpen.Transition.name}
                />
            </div>
            </>
        );
    };

    function getCategoryInfo(element)  {
        if(element.categoryName === selectCategorName)  {
            return element;
        }
    };
    
    const setClassHandleChange = (event, value) => {
        setAllFieldError(false);
        setClassification(value?value:classification);
        if (((value?value:classification)=="sell"||(value?value:classification)=="buy")&&(classification=="board")) {
            setSelectCategoryName('');
        } else if (((value?value:classification)=="board")&&(classification=="sell"||classification=="buy")) {
            setSelectCategoryName('');
        }
    };
    const selectCategorNameHandleChange = (event) => {
        if (categoryFieldError) { //
            setCategoryFieldError(false);
        }
        setSelectCategoryName(event.target.value);
    };

    const afterGetItemCategory = (res) => {
        setItemCategory(res.data.body.result);
    };
    const afterGetPostCategory = (res) => {
        setPostCategory(res.data.body.result);
    };
    const onTitledHandleChange = (e) => {
        if (titleFieldError) {
            setTitleFieldError(false);
        }
        setTitle(e.target.value);
    };
    const onPriceHandleChange = (event) => {
        // let checkNum = /[0-9]{0,9}$/;
        // let checkDigit = /{0,9}/;
        // 최대 999,999,999
        // 숫자만 입력하세요.

        if (priceFieldError) {
            setPriceFieldError(false);
        }
        setPrice(event.target.value);
    };
    const onDescriptionHandleChange = (e) => {
        if (descriptionFieldError) {
            setDescriptionFieldError(false);
        }
        setDescription(e.target.value);
    };
    const onContentsHandleChange = (e) => {
        if (postContentFieldError) {
            setPostContentFieldError(false);
        }
        setContents(e.target.value);
    };
    const onWriteStateHandleChange = (e) => {
        if (writeStateFieldError) {
            setWriteStateFieldError(false);
        }
        setBookState((prevState) => {
            return {
                ...prevState,
                writeState: e.target.value
            }
        });
    };
    const onSurfaceStateHandleChange = (e) => {
        if (surfaceStateFieldError) {
            setSurfaceStateFieldError(false);
        }
        setBookState((prevState) => {
            return {
                ...prevState,
                surfaceState: e.target.value
            }
        });
    };
    const onregularPriceHandleChange = (e) => {
        if (regularPriceFieldError) { // 
            setRegularPriceFieldError(false);
        }
        setBookState((prevState) => {
            return {
                ...prevState,
                regularPrice: e.target.value
            }
        });
    };

    const afterGetLectures = (res) => {
        setLectureList(res.data.body.result.content);
        if (!res.data.body.result.last) {
            setIsLastLecturePage(false);
        } else {
            setIsLastLecturePage(true);
        }
        if (res.data.body.result.first) {
            setIsFirstLecturePage(true);
        } else {
            setIsFirstLecturePage(false);
        }
        setLecturePage(res.data.body.result.pageable.pageNumber);
        console.log(lecturePage);
        console.log(res.data.body);
    };

    const afterItemSaved = (res) => {
        const itemId = res.data.body.result;
        const formData = new FormData();
        formData.append("itemId", itemId);
        Array.from(files).forEach(file => formData.append("file", file));
        // Array.from(imgs).forEach(img => formData.append("file", img));
        UseApi(saveItemImgs, token, setToken, afterItemImgSaved, formData);
    };
    const afterItemImgSaved = (res) => {
        console.log(res);
        window.location.href=`/item/${res.data.body.result}`;
    };
    const afterPostSaved = (res) => {
        const postId = res.data.body.result;
        const formData = new FormData();
        formData.append("postId", postId);
        Array.from(files).forEach(file => formData.append("file", file));
        UseApi(savePostImgs, token, setToken, afterPostImgSaved, formData);
    };
    const afterPostImgSaved = (res) => {
        console.log(res);
        window.location.href=`/board/${res.data.body.result}`;
    };

    const afterItemUpdate = (res) => {
        const itemId = res.data.body.result;
        if (location.state.imgList == origImgs && files.length==0) {
            console.log("imgList is same");
            window.location.href=`/item/${res.data.body.result}`;
        } else {
            console.log({
                itemId: itemId,
                delImgs: delImgs,
                origImgs: origImgs,
                files: files
            });
            const formData = new FormData();
            formData.append("itemId", itemId);
            delImgs.forEach((delImg, idx) => {
                formData.append(`delImgs[${idx}].img`, delImg.img);
                formData.append(`delImgs[${idx}].imgId`, delImg.imgId);
                formData.append(`delImgs[${idx}].seq`, delImg.seq);
                console.log(`delImgs[${idx}].img : ${delImg.img}`)
                console.log(`delImgs[${idx}].imgId : ${delImg.img}`)
                console.log(`delImgs[${idx}].seq : ${delImg.seq}`)
            });
            origImgs.forEach((origImg, idx) => {
                formData.append(`origImgs[${idx}].img`, origImg.img);
                formData.append(`origImgs[${idx}].imgId`, origImg.imgId);
                formData.append(`origImgs[${idx}].seq`, origImg.seq);
            });
            Array.from(files).forEach(file => formData.append("files", file));
            // (async () => {
            UseApi(updateItemImgs, token, setToken, afterItemImgUpdate, formData);
            // })();
        }
        // window.location.href=`/item/${itemId}`;
    };
    const afterItemImgUpdate = (res) => {
        console.log(res);
        window.location.href=`/item/${res.data.body.result}`;
    };
    const afterPostUpdate = (res) => {
        const postId = res.data.body.result;
        if (location.state.imgList == origImgs && files.length==0) {
            window.location.href=`/board/${res.data.body.result}`;
        } else {
            console.log({
                postId: postId,
                delImgs: delImgs,
                origImgs: origImgs,
                files: files
            });
            const formData = new FormData();
            formData.append("postId", postId);
            delImgs.forEach((delImg, idx) => {
                formData.append(`delImgs[${idx}].img`, delImg.img);
                formData.append(`delImgs[${idx}].imgId`, delImg.imgId);
                formData.append(`delImgs[${idx}].seq`, delImg.seq);
                console.log(`delImgs[${idx}].img : ${delImg.img}`)
                console.log(`delImgs[${idx}].imgId : ${delImg.img}`)
                console.log(`delImgs[${idx}].seq : ${delImg.seq}`)
            });
            origImgs.forEach((origImg, idx) => {
                formData.append(`origImgs[${idx}].img`, origImg.img);
                formData.append(`origImgs[${idx}].imgId`, origImg.imgId);
                formData.append(`origImgs[${idx}].seq`, origImg.seq);
            });
            Array.from(files).forEach(file => formData.append("files", file));
            UseApi(updatePostImgs, token, setToken, afterPostImgUpdate, formData);
        }
    };
    const afterPostImgUpdate = (res) => {
        console.log(res);
        window.location.href=`/board/${res.data.body.result}`;
    };

    const [saveOpen, setSaveOpen] = React.useState(false);
    const handleSaveClose = () => {
        setSaveOpen(false);
    };
    const handleToggle = () => {
        setSaveOpen(!saveOpen);
    };
    
    const save = () => {
        let saveDto = {};
        if (classification==="sell") {
            saveDto = {
                classification: classification.toUpperCase(),
                title: title,
                itemCategoryInfo: 
                    // categoryId: selectCategory.categoryId,
                    // categoryName: selectCategory.categoryName
                    itemCategory.find(getCategoryInfo)
                ,
                lectureInfo: {
                    lectureId: lecture.lectureId,
                    lectureName: lecture.lectureName,
                    professorName: lecture.professorName
                },
                bookStateInfo: {
                    writeState: bookState.writeState,
                    surfaceState: bookState.surfaceState,
                    regularPrice: bookState.regularPrice==""?0:bookState.regularPrice
                },
                price: price,
                description: description
            };
            (async () => {
                UseApi(saveItem, token, setToken, afterItemSaved, saveDto);
            })();
        } else if (classification==="buy") {
            saveDto = {
                classification: classification.toUpperCase(),
                title: title,
                itemCategoryInfo: itemCategory.find(getCategoryInfo),
                price: price,
                description: description
            };
            (async () => {
                UseApi(saveItem, token, setToken, afterItemSaved, saveDto);
            })();
        } else if (classification==="board") {
            saveDto = {
                title: title,
                content: contents,
                postCategoryInfo: postCategory.find(getCategoryInfo)
            };
            console.log(saveDto);
            (async () => {
                UseApi(savePost, token, setToken, afterPostSaved, saveDto);
            })();
        } else {
            console.log("내용 작성 바람");
        }
        handleSaveClose();
    };
    const onSaveBtnClick = () => {
        let cond = true;
        if (classification == "sell") {
            if (title == '') {
                cond = false;
                setTitleFieldError(true);
            }
            if (description == '') {
                cond = false;
                setDescriptionFieldError(true);
            }
            if (!(/^[0-9]{0,8}$/.test(price))) {
                // console.log(price);
                // console.log(/^[0-9]{0,8}$/.test(price));
                cond = false;
                setPriceFieldError(true);
            }
            if (selectCategorName == '') {
                cond = false;
                setCategoryFieldError(true);
            } else {
                if (selectCategorName == "대학 교재") {
                    if (bookState.writeState == "") {
                        cond = false;
                        setWriteStateFieldError(true);
                    }
                    if (bookState.surfaceState == "") {
                        cond = false;
                        setSurfaceStateFieldError(true);
                    }
                    if (!(/^[0-9]{0,8}$/.test(bookState.regularPrice))) {
                        // console.log(bookState.regularPrice);
                        cond = false;
                        setRegularPriceFieldError(true);
                    }
                    if (lecture.lectureId == "") {
                        cond = false;
                        setLectureFieldError(true);
                    }
                } else if (selectCategorName == "강의 관련 물품") {
                    if (lecture.lectureId == "") {
                        cond = false;
                        setLectureFieldError(true);
                    }
                } else if (selectCategorName == "서적") {
                    if (bookState.writeState == "") {
                        cond = false;
                        setWriteStateFieldError(true);
                    }
                    if (bookState.surfaceState == "") {
                        cond = false;
                        setSurfaceStateFieldError(true);
                    }
                    if (!(/^[0-9]{0,8}$/.test(bookState.regularPrice))) {
                        // console.log(bookState.regularPrice);
                        cond = false;
                        setRegularPriceFieldError(true);
                    }
                }
            }
        } else if (classification == "buy") {
            if (title == '') {
                cond = false;
                setTitleFieldError(true);
            }
            if (description == '') {
                cond = false;
                setDescriptionFieldError(true);
            }
            if (!(/^[0-9]{0,8}$/.test(price))) {
                // console.log(price);
                // console.log(/^[0-9]{0,8}$/.test(price));
                cond = false;
                setPriceFieldError(true);
            }
            if (selectCategorName == '') {
                cond = false;
                setCategoryFieldError(true);
            }
        } else { // 게시판
            if (title == '') {
                cond = false;
                setTitleFieldError(true);
            }
            if (contents == '') {
                cond = false;
                setPostContentFieldError(true);
            }
            if (selectCategorName == '') {
                cond = false;
                setCategoryFieldError(true);
            }
        }

        if (cond) {
            // setOpen(true);
            setLoading(true);
            save();
            // console.log("데이터 전송");
        }
        // setAllFieldError(true);
    };

    const update = () => {
        let updateDto = {};
        if (classification==="sell") {
            updateDto = {
                itemId: itemId, dto: {
                classification: classification.toUpperCase(),
                title: title,
                itemCategoryInfo: 
                    itemCategory.find(getCategoryInfo)
                ,
                lectureInfo: {
                    lectureId: lecture.lectureId,
                    lectureName: lecture.lectureName,
                    professorName: lecture.professorName
                },
                bookStateInfo: {
                    writeState: bookState.writeState,
                    surfaceState: bookState.surfaceState,
                    regularPrice: bookState.regularPrice
                },
                price: price,
                description: description
            }
            };
            (async () => {
                UseApi(updateItem, token, setToken, afterItemUpdate, updateDto);
            })();
        } else if (classification==="buy") {
            updateDto = {
                itemId: itemId, dto: {
                classification: classification.toUpperCase(),
                title: title,
                itemCategoryInfo: itemCategory.find(getCategoryInfo),
                price: price,
                description: description
                }
            };
            (async () => {
                UseApi(updateItem, token, setToken, afterItemUpdate, updateDto);
            })();
        } else if (classification==="board") {
            console.log("게시물 수정");
            updateDto = {
                postId: itemId, dto: {
                    title: title,
                    content: contents,
                    postCategoryInfo: postCategory.find(getCategoryInfo)
                }
            };
            (async () => {
                UseApi(updatePost, token, setToken, afterPostUpdate, updateDto);
            })();
        } else {
            console.log("내용 작성 바람");
        }
    };
    const onUpdateBtnClick = () => {
        let cond = true;
        if (classification == "sell") {
            if (title == '') {
                cond = false;
                setTitleFieldError(true);
            }
            if (description == '') {
                cond = false;
                setDescriptionFieldError(true);
            }
            if (!(/^[0-9]{0,8}$/.test(price))) {
                cond = false;
                setPriceFieldError(true);
            }
            if (selectCategorName == '') {
                cond = false;
                setCategoryFieldError(true);
            }
        } else if (classification == "buy") {
            if (title == '') {
                cond = false;
                setTitleFieldError(true);
            }
            if (description == '') {
                cond = false;
                setDescriptionFieldError(true);
            }
            if (!(/^[0-9]{0,8}$/.test(price))) {
                // console.log(price);
                // console.log(/^[0-9]{0,8}$/.test(price));
                cond = false;
                setPriceFieldError(true);
            }
            if (selectCategorName == '') {
                cond = false;
                setCategoryFieldError(true);
            }
        } else { // 게시판
            if (title == '') {
                cond = false;
                setTitleFieldError(true);
            }
            if (contents == '') {
                cond = false;
                setPostContentFieldError(true);
            }
            if (selectCategorName == '') {
                cond = false;
                setCategoryFieldError(true);
            }
        }
        console.log(classification);
        console.log(cond);


        if (cond) {
            console.log("do update");
            // setOpen(true);
            setLoading(true);
            update();
        }
    }

    const getLectureList = (pageNum) => {
        (async () => {
            UseApi(getLectures, token, setToken, afterGetLectures, {
                lectureName: modalLectureName,
                professorName: modalProfessorName,
                page: pageNum,
            });
        })();
    };

    const onSearchLectureClick = () => {
        getLectureList(0);
    };

    const onNextButtonClick = () => {
        getLectureList(lecturePage+1);
    };

    const onBackButtonClick = () => {
        getLectureList(lecturePage-1);
    };

    const renderItemCategoryList = () => {
        if (itemCategory.length != 0) {
            return (itemCategory.map((category,idx)=> {
                return <MenuItem id="div_mi" key={"mi"+idx} value={category.categoryName}>{category.categoryName}</MenuItem>
            }));
        }
    };

    const renderPostCategoryList = () => {
        if (postCategory.length != 0) {
            return (postCategory.map((category,idx)=> {
                return <MenuItem id="div_mi" key={"mi"+idx} value={category.categoryName}>{category.categoryName}</MenuItem>
            }));
        }
    };

    const selectLecture = (index) => {
        if (lectureFieldError) {
            setLectureFieldError(false);
        }
        // console.log(lectureList[index]);
        setLecture({
            lectureId: lectureList[index].lectureId,
            lectureName: lectureList[index].lectureName,
            professorName: lectureList[index].professorName,
        });
        handleClose();
    }

    function renderRow(props) {
        const { index, style } = props;
      
        return (
          <ListItem style={style} key={index} component="div" disablePadding>
            <ListItemButton onClick={() => selectLecture(index)}>
              <ListItemText id="listItem" primary={`${lectureList[index].lectureName} - ${lectureList[index].professorName}`} />
            </ListItemButton>
          </ListItem>
        );
    }

    const renderPageControlButton = () => {
        return (
            <div className="div_backAndNext">
            {isFirstLecturePage?null:(<Button id="btn_back" onClick={onBackButtonClick}>이전</Button>)}
            {isLastLecturePage?null:(<Button id="btn_next" onClick={onNextButtonClick}>다음</Button>)}
            </div>
        );
    };

    const renderModal = () => {
        return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        강의 검색
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl id="div_lec" fullWidth>
                            <TextField label="강의명" className='search_lectureName' id="search_lectureName" onChange={onModalLectureNameHandleChange}/>
                        </FormControl>
                        <FormControl id="div_prof" fullWidth>
                            <TextField label="교수명" className='search_professorName' id="search_professorName" onChange={onModalProfessorNameHandleChange}/>
                        </FormControl>
                        <div id="btn_search">
                            <Button onClick={onSearchLectureClick}>검색</Button>
                        </div>
                        <Box
                            sx={{ width: '100%', height: 330, bgcolor: 'background.paper' }}
                        >
                            <FixedSizeList
                                height={300}
                                width={'100%'}
                                itemSize={40}
                                itemCount={lectureList.length}
                                overscanCount={5}
                            >
                                {renderRow}
                            </FixedSizeList>
                        </Box>
                    </Typography>
                    {lectureList.length!==0?renderPageControlButton():null}
                </Box>
            </Modal>
        );
    };

    const renderClassification = () => {
        return (
            <ToggleButtonGroup
                color="primary"
                value={classification}
                exclusive
                fullWidth
                onChange={setClassHandleChange}
                id="btn_group"
            >
                <ToggleButton id="btn_tg" value="sell"><SellIcon id="btn_icon" />팝니다</ToggleButton>
                <ToggleButton id="btn_tg" value="buy"><ShoppingBagIcon id="btn_icon" />삽니다</ToggleButton>
                <ToggleButton id="btn_tg" value="board"><ArticleIcon id="btn_icon" />게시판</ToggleButton>
            </ToggleButtonGroup>
        );
    }

    const renderLectureInfoFields = () => {
        return (
            <>
            <div className="div_lectureInfo" >
                {renderModal()}
                <FormControl fullWidth onClick={handleOpen}>
                    <TextField 
                        label="강의명" 
                        className='txt_lectureName' 
                        id="txt_lectureName" 
                        value={lecture.lectureName} 
                        InputProps={{
                            readOnly: true,
                        }} 
                        InputLabelProps={{
                            shrink: true,
                        }} 
                        sx={{
                            '& > :not(style)': { mb: 1}
                        }}
                        error={lectureFieldError}
                    />
                </FormControl>
                <FormControl fullWidth onClick={handleOpen}>
                    <TextField 
                        label="교수명" 
                        className='txt_professorName' 
                        id="txt_professorName" 
                        value={lecture.professorName} 
                        InputProps={{
                            readOnly: true,
                        }} 
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={lectureFieldError}
                        helperText={lectureFieldError?"강의를 선택해주세요.":null}
                    />
                </FormControl>
            </div>
            </>
        );
    };
    const renderBookStateInfoFields = () => {
        return (
        <>
            <Box className="div_bookStateInfo" fullWidth sx={{
                    '& > :not(style)': { mt: 0.6, mb: 1}
            }}>
                <FormControl fullWidth error={writeStateFieldError}>
                <InputLabel id="wirteState_label">필기상태</InputLabel>
                <Select labelId="wirteState_label" id="txt_writeState" value={bookState.writeState} label="writeState" onChange={onWriteStateHandleChange}>
                    <MenuItem key={"mi"+1} value={"좋음"}>좋음</MenuItem>
                    <MenuItem key={"mi"+2} value={"보통"}>보통</MenuItem>
                    <MenuItem key={"mi"+3} value={"나쁨"}>나쁨</MenuItem>
                </Select>
                {writeStateFieldError?<FormHelperText style={{color: "#d32f2f"}}>상태를 선택하세요.</FormHelperText>:null}
                </FormControl>
                <FormControl fullWidth error={surfaceStateFieldError}>
                <InputLabel id="surfaceState_label">외관상태</InputLabel>
                <Select labelId="surfaceState_label" id="txt_writeState" value={bookState.surfaceState} label="surfaceState" onChange={onSurfaceStateHandleChange}>
                    <MenuItem key={"mi"+4} value={"좋음"}>좋음</MenuItem>
                    <MenuItem key={"mi"+5} value={"보통"}>보통</MenuItem>
                    <MenuItem key={"mi"+6} value={"나쁨"}>나쁨</MenuItem>
                </Select>
                {surfaceStateFieldError?<FormHelperText style={{color: "#d32f2f"}}>상태를 선택하세요.</FormHelperText>:null}
                </FormControl>
                <FormControl fullWidth>
                    <TextField 
                        label="정가" 
                        className='txt_regularPrice' 
                        id="txt_regularPrice" 
                        defaultValue={bookState.regularPrice} 
                        onChange={onregularPriceHandleChange} 
                        InputProps={{
                            endAdornment:(<InputAdornment position="end" style={{marginLeft: 2}}>원</InputAdornment>),
                            style:{paddingRight: 10},
                            inputComponent: NumberFormatCustom,
                        }} 
                        error={regularPriceFieldError}
                        helperText={regularPriceFieldError?"최대 99,999,999원":null}
                    />
                </FormControl>
            </Box>
        </>
        );
    };
    const renderLectureAndBookStateInfoFields = () => {
        return (
            <>
            {renderLectureInfoFields()}
            {renderBookStateInfoFields()}
            </>
        );
    }

    const renderTitleField = () => {
        return (
            <FormControl fullWidth>
                <TextField 
                    label="제목" 
                    className='txt_title' 
                    id="txt_title" 
                    defaultValue={title} 
                    onChange={onTitledHandleChange}
                    error={titleFieldError}
                    helperText={titleFieldError?"제목을 입력하세요.":null}
                />
            </FormControl>
        );
    };

    const renderItemCategory = () => {
        return (
            <FormControl fullWidth error={categoryFieldError}>
                <InputLabel id="category_label">카테고리</InputLabel>
                <Select 
                    defaultValue={selectCategorName} 
                    labelId="category_label" 
                    id="category_select" 
                    value={selectCategorName} 
                    label="category" 
                    onChange={selectCategorNameHandleChange}
                >
                    {renderItemCategoryList()}
                </Select>
                {categoryFieldError?<FormHelperText style={{color: "#d32f2f", marginLeft: 14, marginRight: 14}}>카테고리를 선택하세요.</FormHelperText>:null}
            </FormControl>
        );
    };

    const renderPostCategory = () => {
        return (
            <FormControl fullWidth error={categoryFieldError}>
                <InputLabel id="category_label">카테고리</InputLabel>
                <Select 
                    defaultValue={selectCategorName} 
                    labelId="category_label" 
                    id="category_select" 
                    value={selectCategorName} 
                    label="category" 
                    onChange={selectCategorNameHandleChange}
                >
                    {renderPostCategoryList()}
                </Select>
                {categoryFieldError?<FormHelperText style={{color: "#d32f2f", marginLeft: 14, marginRight: 14}}>카테고리를 선택하세요.</FormHelperText>:null}
            </FormControl>
        );
    };

    const renderPriceField = () => {
        return (
            <FormControl fullWidth>
                <TextField 
                    label="희망가격" 
                    id="txt_price" 
                    defaultValue={price} 
                    onChange={onPriceHandleChange} 
                    InputProps={{
                        endAdornment:(<InputAdornment position="end" style={{marginLeft: 2}}>원</InputAdornment>),
                        style:{paddingRight: 10},
                        inputMode: 'numeric', pattern: '[0-9]*',
                        inputComponent: NumberFormatCustom,
                    }} 
                    error={priceFieldError}
                    helperText={priceFieldError?"최대 99,999,999원":null}
                />
            </FormControl>
        );
    };

    const renderDescriptionFeild = () => {
        return (
            <FormControl fullWidth>
                <TextField 
                    multiline 
                    label="설명" 
                    className='txt_description' 
                    id="txt_description" 
                    defaultValue={description} 
                    onChange={onDescriptionHandleChange} 
                    rows={10}
                    error={descriptionFieldError}
                    helperText={descriptionFieldError?"물품에 대해 설명해주세요.":null}
                />
            </FormControl>
        );
    };

    const renderContentsFeild = () => {
        return (
            <FormControl fullWidth>
                <TextField 
                    multiline 
                    label="내용" 
                    className='txt_contents' 
                    id="txt_contents" 
                    defaultValue={contents} 
                    onChange={onContentsHandleChange} 
                    rows={10}
                    error={postContentFieldError}
                    helperText={postContentFieldError?"게시물 내용을 입력해주세요.":null}
                />
            </FormControl>
        );
    };

    const renderItemInfoFields = () => {
        return (
        <>
            {renderImgs()}
            {renderTitleField()}
            {renderItemCategory()}
            {selectCategorName==="대학 교재"?(renderLectureAndBookStateInfoFields()):(selectCategorName==="강의 관련 물품"?renderLectureInfoFields():(selectCategorName==="서적"?renderBookStateInfoFields():null))}
            {renderPriceField()}
            {renderDescriptionFeild()}
        </>
        );
    };

    const renderBuyItemInfoFields = () => {
        return (
        <>
            {renderImgs()}
            {renderTitleField()}
            {renderItemCategory()}
            {renderPriceField()}
            {renderDescriptionFeild()}
        </>
        );
    };
    
    const renderPostInfoFields = () => {
        return (
        <>
            {renderImgs()}
            {renderTitleField()}
            {renderPostCategory()}
            {renderContentsFeild()}
        </>
        );
    };

    React.useEffect(() => {
        console.log(location.state);
        UseApi(getItemCategory, token, setToken, afterGetItemCategory);
        UseApi(getPostCategory, token, setToken, afterGetPostCategory);
        
    }, []);

    return (
        <>
        <HeaderContainer pageName={itemId==0?(classification==="sell"?"판매 물품 작성":(classification==="buy"?"구매 물품 작성":"게시물 작성")):(classification==="sell"?"판매 물품 수정":(classification==="buy"?"구매 물품 수정":"게시물 수정"))} />
        <Container component="div" maxWidth="xs">
        <Box
                component="form"
                sx={{
                    '& > :not(style)': { mt: 2}
                }}
                noValidate
                autoComplete="off"
        >
            {itemId==0?renderClassification():null}
            {classification==='board'?renderPostInfoFields():(classification==='sell'?renderItemInfoFields():renderBuyItemInfoFields())}
        </Box>

        <div className="div_loadingBtn">
            {itemId==0
                ?<LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                    onClick={() => onSaveBtnClick()}
                >
                    저장
                </LoadingButton>
                :<LoadingButton 
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="contained"
                    onClick={() => onUpdateBtnClick()}
                >
                    수정
                </LoadingButton>
            }
        </div>
        </Container>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
            onClick={handleClick}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        </>
    );
};

export default InputItemInfoPage;