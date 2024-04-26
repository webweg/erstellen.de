/*
 * General help functions
 * Beepworld GmbH
 *
 */


function showHelp(ServerURL, topic) {
  
  if (!ServerURL || !topic) {
  	
	return 0;
	
  }
  
  window.open(ServerURL + '/cgi-bin/hp/apps/help.pl?topic=' + topic,'Help','width=500,height=300');
  
}