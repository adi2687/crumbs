import { useNavigate } from "react-router-dom"; 

const useNavigation=()=>{
    const navigate=useNavigate()
    const opencontact=(path)=>{
        navigate(path)
    }
    return {opencontact}
}
export default useNavigation