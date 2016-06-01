class Menu extends React.Component{

  constructor(props){
    super(props);
    // định nghĩa các state
    this.state = { data:[],root:[], nav :[] };
    // bind các hàm định nghĩa
    this.loadMenu= this.loadMenu.bind(this);
    this.loadMenuByNav=this.loadMenuByNav.bind(this);
  }

  componentDidMount(){
    // load file json, setState
    let config_file="data/menuconfig.json";

    this.serverRequest = $.get(config_file, function (data) {
      this.setState({
          data: data.Menu,
          root: data.Menu
        })
    }.bind(this));
  }

  loadMenu(value,text){
    // load menu có data là value, và hiển thị thanh điều hướng nav theo biến text kèm theo.
    // nếu text bằng null tức là chuyển menu về gốc ,và thanh điều hướng sẽ trống.
    // hàm này xảy ra khi click vào từng menu có menu con.
    if(text){
      var _nav=this.state.nav;

      _nav.push(text);
      this.setState({
        data:value,
        nav :_nav
      })
    }
    else{
      this.setState({
        data:value,
        nav :[]
      })
    }
    // Chuyển sang trạng thái open cho menu
    $('.dropdown').addClass("open");
  }

  loadMenuByNav(value){
    // hàm này có nhiệm vụ hiển thị menu khi click vào thanh nav trên cùng
    // hàm nhận nhận vào là 1 value, trả về menu có data với trường Text bằng value
    var _nav= this.state.nav.slice(0,this.state.nav.indexOf(value)+1);
    var _data=this.state.root;

    if(_nav.length >1 ){
      _nav.map((val) => {
          _data = FindObjectByKey(_data,val)[0].ChildMenu
      })
      this.setState({
          data: _data,
          nav: _nav
      })
    }
    else {
      this.setState({
          data: FindObjectByKey(this.state.root,value)[0].ChildMenu,
          nav: _nav
      })
    }

    $('.dropdown').addClass("open");
  }

  render(){
    // render to HTML
    var length=this.state.nav.length;

    return (
      <ul className="nav navbar-nav navbar-right" >
        <li className="dropdown"><a className="dropdown-toggle" data-toggle="dropdown" href="#"><span className="glyphicon glyphicon-th menu-grid-icon"></span></a>
          <ul className="dropdown-menu row list">
          {/*Start thanh điều hướng menu*/}
            <div className="navigator">
              {length>0 ? <a href="#" onClick={()=>this.loadMenu(this.state.root)}><span className='glyphicon glyphicon-home'></span></a> : <span className='glyphicon glyphicon-home'></span> }
              {this.state.nav.map((val,index) => {
                    if(this.state.nav[length-1] == val){
                      return <p key={index}><span className="becrum glyphicon glyphicon-menu-right"/> {val} </p>
                    }
                    else {
                      return <p key={index}><span className="becrum glyphicon glyphicon-menu-right"/> <a href="#" onClick= { () =>this.loadMenuByNav(val) } >{val}</a></p>
                    }
              })}
              <div className="divider"></div>
            </div>
            {/*End thanh điều hướng menu*/}

            {/*Start menu item*/}
            {Sort(this.state.data).map((val,index) => {
                return <MenuItem {...val} key={index} change={() =>this.loadMenu(val.ChildMenu,val.Text)} />
            })}
            {/*End menu item*/}
          </ul>
        </li>
      </ul>
    )
  }

  componentWillUnmount(){
    // Sau khi componentWillUnmount thì abort request file json
    this.serverRequest.abort();
  }

}

const MenuItem = (props) => {
  // Menu item

  return(
    <li className="col-sm-4 col-xs-4">
      {/*Nếu có menu con thì set onclick để khi click vào mở menu con, nếu không thì không set onClick*/}
      <div className="menuitem" onClick={props.ChildMenu ? props.change : () => window.open(props.Link)  }>
        <div className="menu" >
          <span><img className="img-responsive" src={props.Icon_url} alt="" /></span>
          {/*nếu có menu con thì hiển thị text ... không thì hiển thị text*/}
          <div dangerouslySetInnerHTML={{__html: props.ChildMenu ? props.Text+" ..." : props.Text}} />
        </div>
      </div>
    </li>
  )
}

const Sort = (obj) => {
  // hàm này nhận vào 1 obj và sắp xếp nó theo trường Num tăng dần
  var _obj=[];
  Object.keys(obj).map( (index) =>{ _obj.push(obj[index]) } );
  return _obj.sort( (a,b) => { return (a.Num > b.Num) ? 1 : ((b.Num > a.Num) ? -1 : 0) } )
}

const FindObjectByKey = (obj,key) => {
  // hàm này trả về 1 object có trường Text = key trong obj
  var _obj=[];
  Object.keys(obj).map( (index) =>{ _obj.push(obj[index]) } );
  return _obj.filter( (a) => { return a.Text==key } )
}

ReactDOM.render(
	<Menu />,
	document.getElementById('menu')
)
