import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  name: '',
  email: '',
  access_token: '',
  password: '',
  address: '',
  phone: '',
  city:'',
  sex: '',
  avatar: '',
  isAdmin: false,
  refreshToken: ''
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state,action) =>{
      const {name = '', email = '',password = '',address = '',phone ='',sex = '', avatar = '', access_token = '',_id='',isAdmin,refreshToken = '',  city=''} = action.payload
      state.id = _id;
      state.name = name;
      state.email = email;
      state.password = password;
      state.address = address;
      state.phone = phone;
      state.sex = sex;
      state.city = city;
      state.avatar = avatar;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.refreshToken = refreshToken ? refreshToken : state.refreshToken;
    },
    resetUser: (state) =>{
      state.id = '';
      state.name = '';
      state.email = '';
      state.password = '';
      state.address = '';
      state.phone = '';
      state.sex = '';
      state.city = '';
      state.avatar = '';
      state.access_token = '';
      state.isAdmin = false;
      state.refreshToken = ''
  }
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, resetUser} = userSlide.actions

export default userSlide.reducer