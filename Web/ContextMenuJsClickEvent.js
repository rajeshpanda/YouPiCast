 var url = window.location.href;  
 var index = url.indexOf('?v=');  
 var id = url.substring(index+3, url.length);  
 $.ajax({  
      url: '192.168.0.115:5000/yt/' + id,  
      method: 'GET',  
      success: function(result){  
      },  
      error: function(err){  
           alert('The video cannot be added.');  
      }  
 });