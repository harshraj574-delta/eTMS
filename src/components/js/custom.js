

// Toast
const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}



// Enable popovers via JavaScript 
var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
});

// Enable Tooltip via JavaScript
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));




// For Repeat Section
function multiplyNode(node, count, deep) {		
  for (var i = 0, copy; i < count - 1; i++) {		
    copy = node.cloneNode(deep);		
    node.parentNode.insertBefore(copy, node);		
  }		
}	
multiplyNode(document.querySelector('.column'), 5, true);	
multiplyNode(document.querySelector('.boxRepeat'), 6, true);

// For DataTable
$(document).ready(function() {
  $('#example tfoot th').each(function() {
      var title = $(this).text();
      $(this).html('<input type="text" placeholder="Search ' + title + '" />');
  });

  var table = $('#example').DataTable({
      searchPanes: {
          viewTotal: true
      },
      dom: 'Plfrtip'
  });

    table.columns().every( function() {
      var that = this;  
      $('input', this.footer()).on('keyup change', function() {
          if (that.search() !== this.value) {
              that
                  .search(this.value)
                  .draw();
          }
      });
  });
});

function toggle(e) {
  const txt = e.innerText;
  e.innerText = txt == 'add' ? 'remove' : 'add';
}



function trActive(element) {  
  element.classList.toggle('highlight');
}

function statActive(element) {  
  //element.classList.remove(this);
  element.classList.add('active');
}

function open_menu() {
  var element = document.getElementById('content');
  element.classList.toggle('middle-full');
}

function open_sidebar() {
  var element = document.getElementById('menu');
  element.classList.toggle('sidebarClose');
}

// Function to open a specific tab
function openTab(tabName) {
  var i;
  var tabContent = document.getElementsByClassName("tab-pane");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none";
  }
  document.getElementById(tabName).style.display = "block";
}
// Initially, display the first tab
openTab("tab1");




