window.onload = function(){ // wait for entire page to load first     // var patharray = location.pathname // get current page path
    // making menu active based on base url
    var pathArray = location.pathname.split("/") // get current page path
    // console.log('pathArray',pathArray)
    var folderName = pathArray[3]     // alert(folderName)
    if(folderName == "" || folderName == undefined){
        document.getElementById("a-dashboard").className = "a-nav-sidebar-currentpage f-0-8" // alert(folderName)
    } else {
        var nav = document.getElementById("a-nav-sidebar")
        var links = nav.getElementsByTagName("a")         // alert(links.length)
        for(i = 1; i < links.length; i++){
            if(links[i].getAttribute("href").indexOf(folderName) > -1) {
                links[i].className = "a-nav-sidebar-currentpage f-0-8"
            }
        }
    }
}