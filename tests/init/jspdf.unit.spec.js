
/* global describe, xit, it, jsPDF, comparePdf, jasmine, expect */
/**
 * Standard spec tests
 *
 * These tests return the datauristring so that reference files can be generated.
 * We compare the exact output.
 */

describe('jsPDF unit tests', () => {

  //PubSub-Functionality
  
  it('jsPDF PubSub basic check', () => {
    var pubSub;
    var testContext = {};
    pubSub = new (new jsPDF).__private__.PubSub(testContext);
    expect(typeof (new jsPDF).__private__.PubSub).toEqual('function');
    expect(function () {new (new jsPDF).__private__.PubSub('invalid')}).toThrow(new Error ('Invalid Context passed to initialize PubSub (jsPDF-module)'));
  });
  it('jsPDF PubSub subscribe/subscribe', () => {
    expect(typeof (new jsPDF).__private__.PubSub).toEqual('function');

    var pubSub;
    var testContext = {};
    var token;
    pubSub = new (new jsPDF).__private__.PubSub(testContext);
    
    expect(function() {pubSub.subscribe('testEvent', function () {}, true);}).not.toThrow(new Error('Invalid arguments passed to PubSub.subscribe (jsPDF-module)'));
    expect(function() {pubSub.subscribe('testEvent', 'invalid');}).toThrow(new Error('Invalid arguments passed to PubSub.subscribe (jsPDF-module)'));
    expect(function() {pubSub.subscribe(1, function () {});}).toThrow(new Error('Invalid arguments passed to PubSub.subscribe (jsPDF-module)'));
    expect(function() {pubSub.subscribe('testEvent', function () {}, 'invalid');}).toThrow(new Error('Invalid arguments passed to PubSub.subscribe (jsPDF-module)'));
   
    expect(typeof pubSub.subscribe('testEvent', function() {}) === "string").toEqual(true);
    expect(Object.keys(pubSub.getTopics()).length).toEqual(1);
    
    //check token
    expect(pubSub.subscribe('testEvent', function() {}).length > 0).toEqual(true);
    
    testContext = {};
    pubSub = new (new jsPDF).__private__.PubSub(testContext);
    pubSub.subscribe('testEvent', function() {});
    expect(Object.keys(pubSub.getTopics()).length).toEqual(1);
    pubSub.subscribe('testEvent', function() {});
    expect(Object.keys(pubSub.getTopics()).length).toEqual(1);
    
    token = pubSub.subscribe('testEvent2', function() {});
    expect(Object.keys(pubSub.getTopics()).length).toEqual(2);
    
    pubSub.unsubscribe('invalid');
    expect(Object.keys(pubSub.getTopics()).length).toEqual(2);
    
    pubSub.unsubscribe(token);
    expect(Object.keys(pubSub.getTopics()).length).toEqual(1);

    token = pubSub.subscribe('testEvent2', function() {});
    expect(Object.keys(pubSub.getTopics()).length).toEqual(2);

    token = pubSub.subscribe('testEvent2', function() {});
    expect(Object.keys(pubSub.getTopics()).length).toEqual(2);
    
    pubSub.unsubscribe(token);
    expect(Object.keys(pubSub.getTopics()).length).toEqual(2);
    
  })

  //PubSub-Functionality
  it('jsPDF PubSub publish', () => {    
    var pubSub;
    var testContext = {success: false, testFunction : function () {this.success = true;}, malFunction : null};
    var token;
    var originalConsole = console.error;
    var tmpErrorMessage = '';
    
    console.error = (function (value) { tmpErrorMessage = value });
    pubSub = new (new jsPDF).__private__.PubSub(testContext);
    
    token = pubSub.subscribe('testEvent', function() {this.testFunction()});
    pubSub.publish('testEvent');
    expect(testContext.success).toEqual(true);
    pubSub.unsubscribe(token);
    testContext.success = false;
    
    token = pubSub.subscribe('testEvent', function() {this.malFunction()});
    pubSub.publish('testEvent');
    expect(tmpErrorMessage).toEqual('jsPDF PubSub Error');
    expect(testContext.success).toEqual(false);
    pubSub.unsubscribe(token);
    testContext.success = false;
    
    
    testContext = {success: false, testFunction : function () {this.success = true;}, malFunction : null};
    
    token = pubSub.subscribe('testEvent', function() {this.testFunction()}, true);
    pubSub.publish('testEvent');
    expect(Object.keys(pubSub.getTopics()).length).toEqual(0);
    
    console.error = originalConsole;
  })

  it('jsPDF internal/private function getPDFVersion', () => {
    const doc = new jsPDF(); 
    expect(doc.internal.getPDFVersion()).toEqual('1.3');
    expect(doc.__private__.getPdfVersion()).toEqual('1.3');
  })
  
  it('jsPDF private function setPDFVersion', () => {
    const doc = new jsPDF();
    expect(doc.__private__.getPdfVersion()).toEqual('1.3');
    doc.__private__.setPdfVersion('1.5');
    expect(doc.__private__.getPdfVersion()).toEqual('1.5');
  })
  
  it('jsPDF private function getPageFormats', () => {
    const doc = new jsPDF(); 
    expect(Object.keys(doc.__private__.getPageFormats()).length).toEqual(41);
  })
  
  it('jsPDF private function getPageFormat', () => {
    const doc = new jsPDF(); 
    expect(doc.__private__.getPageFormat('a4')[0]).toEqual(595.28);
    expect(doc.__private__.getPageFormat('a4')[1]).toEqual(841.89);
  })
  
  it('jsPDF private function f2', () => {
    const doc = new jsPDF(); 
    expect(doc.__private__.f2(2.22222)).toEqual('2.22');
    
    expect(function() {doc.__private__.f2('invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.f2')); 
  })
  
  it('jsPDF private function f3', () => {
    const doc = new jsPDF(); 
    expect(doc.__private__.f3(2.22222)).toEqual('2.222');
    
    expect(function() {doc.__private__.f3('invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.f3')); 
  })
  
  it('jsPDF private function getFileId, setFileId', () => {
    const doc = new jsPDF(); 
    doc.__private__.setFileId('0000000000000000000000000BADFACE')
    expect(doc.__private__.getFileId()).toEqual('0000000000000000000000000BADFACE');
  })
  
  it('jsPDF public function getFileId, setFileId', () => {
    const doc = new jsPDF(); 
    doc.setFileId('0000000000000000000000000BADFACE')
    expect(doc.getFileId()).toEqual('0000000000000000000000000BADFACE');
  })
  
  
  it('jsPDF private function getCreationDate', () => {
    const doc = jsPDF();
    var regexPDFCreationDate = (/^D:(20[0-2][0-9]|203[0-7]|19[7-9][0-9])(0[0-9]|1[0-2])([0-2][0-9]|3[0-1])(0[0-9]|1[0-9]|2[0-3])(0[0-9]|[1-5][0-9])(0[0-9]|[1-5][0-9])(\+0[0-9]|\+1[0-4]|\-0[0-9]|\-1[0-1])\'(0[0-9]|[1-5][0-9])\'?$/);

    expect(regexPDFCreationDate.test(doc.__private__.setCreationDate())).toEqual(true);

    var creationDate = new Date();
    doc.__private__.setCreationDate(creationDate);
    expect(doc.__private__.getCreationDate("jsDate").getFullYear()).toEqual(creationDate.getFullYear());
    expect(doc.__private__.getCreationDate("jsDate").getMonth()).toEqual(creationDate.getMonth());
    expect(doc.__private__.getCreationDate("jsDate").getDate()).toEqual(creationDate.getDate());
    expect(doc.__private__.getCreationDate("jsDate").getHours()).toEqual(creationDate.getHours());
    expect(doc.__private__.getCreationDate("jsDate").getMinutes()).toEqual(creationDate.getMinutes());
    expect(doc.__private__.getCreationDate("jsDate").getSeconds()).toEqual(creationDate.getSeconds());

  });
  
  it('jsPDF private function setCreationDate', () => {
    const doc = jsPDF();
    var creationDate = new Date(1987,11,10,0,0,0);
    var pdfDateString = "D:19871210000000+00'00'";
    doc.__private__.setCreationDate(pdfDateString);
    expect(doc.__private__.getCreationDate("jsDate").getFullYear()).toEqual(creationDate.getFullYear());
    expect(doc.__private__.getCreationDate("jsDate").getMonth()).toEqual(creationDate.getMonth());
    expect(doc.__private__.getCreationDate("jsDate").getDate()).toEqual(creationDate.getDate());
    expect(doc.__private__.getCreationDate("jsDate").getHours()).toEqual(creationDate.getHours());
    expect(doc.__private__.getCreationDate("jsDate").getMinutes()).toEqual(creationDate.getMinutes());
    expect(doc.__private__.getCreationDate("jsDate").getSeconds()).toEqual(creationDate.getSeconds());

    expect(function() {doc.__private__.setCreationDate('invalid');}).toThrow(new Error('Invalid argument passed to jsPDF.setCreationDate')); 
  });
  
  it('jsPDF public function getCreationDate', () => {
    const doc = jsPDF();
    var creationDate = new Date();
    doc.setCreationDate(creationDate);
    expect(doc.getCreationDate("jsDate").getFullYear()).toEqual(creationDate.getFullYear());
    expect(doc.getCreationDate("jsDate").getMonth()).toEqual(creationDate.getMonth());
    expect(doc.getCreationDate("jsDate").getDate()).toEqual(creationDate.getDate());
    expect(doc.getCreationDate("jsDate").getHours()).toEqual(creationDate.getHours());
    expect(doc.getCreationDate("jsDate").getMinutes()).toEqual(creationDate.getMinutes());
    expect(doc.getCreationDate("jsDate").getSeconds()).toEqual(creationDate.getSeconds());
  });
  
  it('jsPDF public function setCreationDate', () => {
    const doc = jsPDF();
    var creationDate = new Date(1987,11,10,0,0,0);
    var pdfDateString = "D:19871210000000+00'00'";
    doc.setCreationDate(pdfDateString);
    expect(doc.getCreationDate("jsDate").getFullYear()).toEqual(creationDate.getFullYear());
    expect(doc.getCreationDate("jsDate").getMonth()).toEqual(creationDate.getMonth());
    expect(doc.getCreationDate("jsDate").getDate()).toEqual(creationDate.getDate());
    expect(doc.getCreationDate("jsDate").getHours()).toEqual(creationDate.getHours());
    expect(doc.getCreationDate("jsDate").getMinutes()).toEqual(creationDate.getMinutes());
    expect(doc.getCreationDate("jsDate").getSeconds()).toEqual(creationDate.getSeconds());
  });
  
  it('jsPDF private function padd2', () => {
    const doc = jsPDF();
    expect(doc.__private__.padd2(2)).toEqual('02');
    expect(doc.__private__.padd2(23)).toEqual('23');
    expect(doc.__private__.padd2(234)).toEqual('34');
  });

  it('jsPDF private function getFilters', () => {
    var doc = jsPDF();
    expect(doc.__private__.getFilters()).toEqual([]);
    doc = jsPDF({filters:'FlateEncode'});
    expect(doc.__private__.getFilters()).toEqual('FlateEncode');
    doc = jsPDF({filters: ['FlateEncode']});
    expect(doc.__private__.getFilters()).toEqual(['FlateEncode']);
    doc = jsPDF({compress: true});
    expect(doc.__private__.getFilters()).toEqual(['FlateEncode']);
    doc = jsPDF({compress: false});
    expect(doc.__private__.getFilters()).toEqual([]);
  });
  
  
  it('jsPDF private function newObject', () => {
    const doc = jsPDF();

    expect( doc.__private__.newObject()).toEqual(3);
    expect( doc.__private__.newObject()).toEqual(4);
    expect( doc.__private__.newObject()).toEqual(5);
  });
  
  
  it('jsPDF private function newAdditionalObject', () => {
    const doc = jsPDF();

    expect( doc.__private__.newAdditionalObject()).toEqual({"objId":5,"content":""});
  });
  

  
  
  it('jsPDF private function newObjectDeferred', () => {
    const doc = jsPDF();

    expect( doc.__private__.newObjectDeferred()).toEqual(3);
    expect( doc.__private__.newObjectDeferred()).toEqual(4);
    expect( doc.__private__.newObjectDeferred()).toEqual(5);
  });
  

  it('jsPDF private function out', () => {
    const doc = jsPDF();
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    writeArray = doc.__private__.out(2);
    expect(writeArray[0]).toEqual('2');

    doc.__private__.resetCustomOutputDestination();
  });

  
  
  it('jsPDF private function out', () => {
    const doc = jsPDF();
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    writeArray = doc.__private__.out(2);
    expect(writeArray[0]).toEqual('2');

    doc.__private__.resetCustomOutputDestination();
  });

  it('jsPDF private function write', () => {
    var doc = jsPDF();
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    writeArray = doc.__private__.write('test');
    expect(writeArray[0]).toEqual('test');

    doc = jsPDF();
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    writeArray = doc.__private__.write('test', 'test2');
    expect(writeArray[0]).toEqual('test test2');

  });
  
  
  it('jsPDF private function pdfEscape', () => {
    const doc = jsPDF();
    expect(doc.__private__.pdfEscape('Test')).toEqual('Test');
    expect(doc.__private__.pdfEscape('(Test')).toEqual('\\(Test');
    expect(doc.__private__.pdfEscape('(Test)')).toEqual('\\(Test\\)');
    expect(doc.__private__.pdfEscape("\\Test")).toEqual("\\\\Test");
    expect(doc.__private__.pdfEscape("\\(Test")).toEqual('\\\\\\(Test');
    
    doc.__private__.resetCustomOutputDestination();
  });  
  
  
  it('jsPDF private function getNumberOfPages', () => {
    const doc = jsPDF()
    expect(doc.__private__.getNumberOfPages()).toEqual(1);
    doc.addPage();
    expect(doc.__private__.getNumberOfPages()).toEqual(2);
    doc.addPage();
    expect(doc.__private__.getNumberOfPages()).toEqual(3);
    doc.addPage();
    expect(doc.__private__.getNumberOfPages()).toEqual(4);
   });
  
  it('jsPDF internal function getPageInfo', () => {
    const doc = jsPDF()
    doc.addPage();
    doc.addPage();
    expect(doc.internal.getPageInfo(1)).toEqual({ objId: 3, pageNumber: 1, pageContext: {dimensions: { width: 210.0015555555555, height: 297.0000833333333 }} });
    expect(doc.internal.getPageInfo(2)).toEqual({ objId: 5, pageNumber: 2, pageContext: {dimensions: { width: 210.0015555555555, height: 297.0000833333333 }} });
    expect(doc.internal.getPageInfo(3)).toEqual({ objId: 7, pageNumber: 3, pageContext: {dimensions: { width: 210.0015555555555, height: 297.0000833333333 }} });
    
    expect(function() {doc.internal.getPageInfo('invalid');}).toThrow(new Error('Invalid argument passed to jsPDF.getPageInfo'));
    expect(function() {doc.internal.getPageInfo(3.14);}).toThrow(new Error('Invalid argument passed to jsPDF.getPageInfo')); 
  });
  
  
  it('jsPDF private function getPageInfo', () => {
    const doc = jsPDF()
    doc.addPage();
    doc.addPage();
    expect(doc.__private__.getPageInfo(1)).toEqual({ objId: 3, pageNumber: 1, pageContext: {dimensions: { width: 210.0015555555555, height: 297.0000833333333 }} });
    expect(doc.__private__.getPageInfo(2)).toEqual({ objId: 5, pageNumber: 2, pageContext: {dimensions: { width: 210.0015555555555, height: 297.0000833333333 }} });
    expect(doc.__private__.getPageInfo(3)).toEqual({ objId: 7, pageNumber: 3, pageContext: {dimensions: { width: 210.0015555555555, height: 297.0000833333333 }} });
    
    expect(function() {doc.__private__.getPageInfo('invalid');}).toThrow(new Error('Invalid argument passed to jsPDF.getPageInfo'));
    expect(function() {doc.__private__.getPageInfo(3.14);}).toThrow(new Error('Invalid argument passed to jsPDF.getPageInfo')); 
  });
  
  it('jsPDF private function getCurrentPageInfo', () => {
    const doc = jsPDF()
    doc.addPage();
    doc.addPage();
    expect(doc.__private__.getCurrentPageInfo()).toEqual({ objId: 7, pageNumber: 3, pageContext: {dimensions: { width: 210.0015555555555, height: 297.0000833333333 }} });
  });
  
  it('jsPDF private function getArrayBuffer', () => {
    const doc = jsPDF();
    expect(doc.__private__.getArrayBuffer('A').byteLength).toEqual(1);
    expect(doc.__private__.getArrayBuffer('A') instanceof ArrayBuffer).toEqual(true);
  });
  
  it('jsPDF private function getBlob', () => {
    const doc = new jsPDF();
    expect(typeof doc.__private__.getBlob('A')).toEqual('object');
    expect(doc.__private__.getBlob('A') instanceof Blob).toEqual(true);
    expect(doc.__private__.getBlob('A').type).toEqual("application/pdf");
  });
  
  it('jsPDF private function output', () => {
    var doc = new jsPDF();

    doc.__private__.setFileId('0000000000000000000000000BADFACE');
    doc.__private__.setCreationDate("D:19871210000000+00'00'")
	
	var data = ["%PDF-1.3","%ºß¬à","3 0 obj","<</Type /Page","/Parent 1 0 R","/Resources 2 0 R","/MediaBox [0 0 595.28 841.89]","/Contents 4 0 R",">>","endobj","4 0 obj","<<","/Length 10",">>","stream","0.57 w\n0 G","endstream","endobj","1 0 obj","<</Type /Pages","/Kids [3 0 R ]","/Count 1",">>","endobj","5 0 obj","<<","/Type /Font","/BaseFont /Helvetica","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","6 0 obj","<<","/Type /Font","/BaseFont /Helvetica-Bold","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","7 0 obj","<<","/Type /Font","/BaseFont /Helvetica-Oblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","8 0 obj","<<","/Type /Font","/BaseFont /Helvetica-BoldOblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","9 0 obj","<<","/Type /Font","/BaseFont /Courier","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","10 0 obj","<<","/Type /Font","/BaseFont /Courier-Bold","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","11 0 obj","<<","/Type /Font","/BaseFont /Courier-Oblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","12 0 obj","<<","/Type /Font","/BaseFont /Courier-BoldOblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","13 0 obj","<<","/Type /Font","/BaseFont /Times-Roman","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","14 0 obj","<<","/Type /Font","/BaseFont /Times-Bold","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","15 0 obj","<<","/Type /Font","/BaseFont /Times-Italic","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","16 0 obj","<<","/Type /Font","/BaseFont /Times-BoldItalic","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","17 0 obj","<<","/Type /Font","/BaseFont /ZapfDingbats","/Subtype /Type1","/FirstChar 32","/LastChar 255",">>","endobj","18 0 obj","<<","/Type /Font","/BaseFont /Symbol","/Subtype /Type1","/FirstChar 32","/LastChar 255",">>","endobj","2 0 obj","<<","/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]","/Font <<","/F1 5 0 R","/F2 6 0 R","/F3 7 0 R","/F4 8 0 R","/F5 9 0 R","/F6 10 0 R","/F7 11 0 R","/F8 12 0 R","/F9 13 0 R","/F10 14 0 R","/F11 15 0 R","/F12 16 0 R","/F13 17 0 R","/F14 18 0 R",">>","/XObject <<",">>",">>","endobj","19 0 obj","<<","/Producer (jsPDF 0.0.0)","/CreationDate (D:19871210000000+00'00')",">>","endobj","20 0 obj","<<","/Type /Catalog","/Pages 1 0 R","/OpenAction [3 0 R /FitH null]","/PageLayout /OneColumn",">>","endobj","xref","0 21","0000000000 65535 f ","0000000184 00000 n ","0000002001 00000 n ","0000000015 00000 n ","0000000124 00000 n ","0000000241 00000 n ","0000000366 00000 n ","0000000496 00000 n ","0000000629 00000 n ","0000000766 00000 n ","0000000889 00000 n ","0000001018 00000 n ","0000001150 00000 n ","0000001286 00000 n ","0000001414 00000 n ","0000001541 00000 n ","0000001670 00000 n ","0000001803 00000 n ","0000001905 00000 n ","0000002249 00000 n ","0000002335 00000 n ","trailer","<<","/Size 21","/Root 20 0 R","/Info 19 0 R","/ID [ <0000000000000000000000000BADFACE> <0000000000000000000000000BADFACE> ]",">>","startxref","2439","%%EOF"];
    expect(doc.__private__.output()).toEqual(data.join("\n"));
	
	
	expect(doc.__private__.output('arraybuffer') instanceof ArrayBuffer).toEqual(true);
	
	expect(doc.__private__.output('blob') instanceof Blob).toEqual(true);
	
	expect(doc.__private__.output('datauristring')).toEqual('data:application/pdf;filename=generated.pdf;base64,' + btoa(data.join("\n")));
	expect(doc.__private__.output('dataurlstring')).toEqual('data:application/pdf;filename=generated.pdf;base64,' + btoa(data.join("\n")));
	
    expect(doc.__private__.output('invalid')).toEqual(null); 
  });
  
  //Font-Functionality
  it('jsPDF private function getStandardFonts', () => {
    const doc = jsPDF()
    const fontList = doc.__private__.getStandardFonts();
    expect(fontList).toEqual([
      ['Helvetica', "helvetica", "normal", 'WinAnsiEncoding'],
      ['Helvetica-Bold', "helvetica", "bold", 'WinAnsiEncoding'],
      ['Helvetica-Oblique', "helvetica", "italic", 'WinAnsiEncoding'],
      ['Helvetica-BoldOblique',"helvetica", "bolditalic", 'WinAnsiEncoding'],
      ['Courier', "courier", "normal", 'WinAnsiEncoding'],
      ['Courier-Bold', "courier", "bold", 'WinAnsiEncoding'],
      ['Courier-Oblique', "courier", "italic", 'WinAnsiEncoding'],
      ['Courier-BoldOblique', "courier", "bolditalic", 'WinAnsiEncoding'],
      ['Times-Roman', "times", "normal", 'WinAnsiEncoding'],
      ['Times-Bold', "times", "bold", 'WinAnsiEncoding'],
      ['Times-Italic', "times", "italic", 'WinAnsiEncoding'],
      ['Times-BoldItalic', "times", "bolditalic", 'WinAnsiEncoding'],
      ['ZapfDingbats', "zapfdingbats", "normal", null],
      ['Symbol', "symbol", "normal", null]
    ])
  })
  
  it('jsPDF private function getFontList', () => {
    const doc = jsPDF()
    expect(doc.__private__.getFontList()).toEqual({"helvetica":["normal","bold","italic","bolditalic"],"Helvetica":["","Bold","Oblique","BoldOblique"],"courier":["normal","bold","italic","bolditalic"],"Courier":["","Bold","Oblique","BoldOblique"],"times":["normal","bold","italic","bolditalic"],"Times":["Roman","Bold","Italic","BoldItalic"],"zapfdingbats":["normal"],"ZapfDingbats":[""],"symbol":["normal"],"Symbol":[""]});
  });
  
  it('jsPDF public function getFontSize', () => {
    const doc = jsPDF()
    
    expect(doc.getFontSize()).toEqual(16);
  });
  
  it('jsPDF public function setFontSize', () => {
    const doc = jsPDF()
    expect(doc.getFontSize()).toEqual(16);
    doc.setFontSize(20);
    expect(doc.getFontSize()).toEqual(20);
  });
  
  it('jsPDF private function getCharSpace', () => {
    const doc = jsPDF()
    
    expect(doc.__private__.getCharSpace()).toEqual(0);
  });
  
  it('jsPDF private function setCharSpace', () => {
    const doc = jsPDF()
    doc.__private__.setCharSpace(2);
    
    expect(doc.__private__.getCharSpace()).toEqual(2);
    expect(function() {doc.__private__.setCharSpace('invalid');}).toThrow(new Error('Invalid argument passed to jsPDF.setCharSpace')); 
  });
  
  it('jsPDF private function getLineWidth', () => {
    const doc = jsPDF()
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.setLineWidth(595.28);
    
    expect(writeArray).toEqual(['1687.41 w']);
  });
  
  it('jsPDF private function getLineHeight', () => {
    const doc = jsPDF()
    
    expect(doc.__private__.getLineHeight()).toEqual(16 * 1.15);
  });
  
  it('jsPDF private function getHorizontalCoordinate', () => {
    const doc = jsPDF()
    
    expect(doc.__private__.getHorizontalCoordinate(10)).toEqual('28.35');
    expect(doc.__private__.getHorizontalCoordinate(100)).toEqual('283.46');
  });
  
  it('jsPDF private function getVerticalCoordinate', () => {
    const doc = jsPDF()
    
    expect(doc.__private__.getVerticalCoordinate(10)).toEqual('813.54');
  });
  
  it('jsPDF public function pageSize', () => {
    var doc = jsPDF()
    
    expect(doc.internal.pageSize.getHeight()).toEqual(297.0000833333333);

    doc = jsPDF('p', 'pt', 'a4')
    expect(doc.internal.pageSize.getHeight()).toEqual(841.89);
    expect(doc.internal.pageSize.height).toEqual(841.89);
    expect(doc.internal.pageSize.getWidth()).toEqual(595.28);
    expect(doc.internal.pageSize.width).toEqual(595.28);
	
    doc = jsPDF('p', 'pt', 'a4')
	doc.internal.pageSize.setHeight(595.28);
    expect(doc.internal.pageSize.getHeight()).toEqual(595.28);
    expect(doc.internal.pageSize.height).toEqual(595.28);
    expect(doc.internal.pageSize.getWidth()).toEqual(595.28);
    expect(doc.internal.pageSize.width).toEqual(595.28);
	
    doc = jsPDF('p', 'pt', 'a4')
	doc.internal.pageSize.height = 595.28;
    expect(doc.internal.pageSize.getHeight()).toEqual(595.28);
    expect(doc.internal.pageSize.height).toEqual(595.28);
    expect(doc.internal.pageSize.getWidth()).toEqual(595.28);
    expect(doc.internal.pageSize.width).toEqual(595.28);
	
    doc = jsPDF('p', 'pt', 'a4')
	doc.internal.pageSize.setWidth(841.89);
    expect(doc.internal.pageSize.getHeight()).toEqual(841.89);
    expect(doc.internal.pageSize.height).toEqual(841.89);
    expect(doc.internal.pageSize.getWidth()).toEqual(841.89);
    expect(doc.internal.pageSize.width).toEqual(841.89);
	
    doc = jsPDF('p', 'pt', 'a4')
	doc.internal.pageSize.width = 841.89;
    expect(doc.internal.pageSize.getHeight()).toEqual(841.89);
    expect(doc.internal.pageSize.height).toEqual(841.89);
    expect(doc.internal.pageSize.getWidth()).toEqual(841.89);
    expect(doc.internal.pageSize.width).toEqual(841.89);
	
    doc = jsPDF('p', 'pt', 'a4')
	doc.internal.pageSize.height = 595.28;
	doc.internal.pageSize.width = 841.89;
    expect(doc.internal.pageSize.getHeight()).toEqual(595.28);
    expect(doc.internal.pageSize.height).toEqual(595.28);
    expect(doc.internal.pageSize.getWidth()).toEqual(841.89);
    expect(doc.internal.pageSize.width).toEqual(841.89);
	
  });
  it('jsPDF private function getR2L', () => {
    const doc = jsPDF()
    
    expect(doc.__private__.getR2L()).toEqual(false);
  });
  
  it('jsPDF private function setR2L', () => {
    const doc = jsPDF()
    expect(doc.__private__.getR2L()).toEqual(false);
    doc.setR2L(true);
    expect(doc.__private__.getR2L()).toEqual(true);
  });
  
  it('jsPDF public function setR2L', () => {
    const doc = jsPDF()
    expect(doc.getR2L()).toEqual(false);
    doc.setR2L(true);
    expect(doc.getR2L()).toEqual(true);
  });
  
  it('jsPDF public function getR2L', () => {
    const doc = jsPDF()
    
    expect(doc.getR2L()).toEqual(false);
  });
  
  it('jsPDF private function setR2L', () => {
    const doc = jsPDF()
    expect(doc.getR2L()).toEqual(false);
    doc.setR2L(true);
    expect(doc.getR2L()).toEqual(true);
  });
  
  it('jsPDF private function setZoomMode, getZoomMode', () => {
    const doc = jsPDF();
    doc.__private__.setZoomMode(2);
    expect(doc.__private__.getZoomMode()).toEqual(2);
    doc.__private__.setZoomMode('200%');
    expect(doc.__private__.getZoomMode()).toEqual('200%');
    doc.__private__.setZoomMode('fullwidth');
    expect(doc.__private__.getZoomMode()).toEqual('fullwidth');
    doc.__private__.setZoomMode('fullheight');
    expect(doc.__private__.getZoomMode()).toEqual('fullheight');
    doc.__private__.setZoomMode('original');
    expect(doc.__private__.getZoomMode()).toEqual('original');
    expect(function() {doc.__private__.setZoomMode('invalid');}).toThrow(new Error('zoom must be Integer (e.g. 2), a percentage Value (e.g. 300%) or fullwidth, fullheight, fullpage, original. "invalid" is not recognized.')); 
  });

  it('jsPDF private function setLayoutMode, getLayoutMode', () => {
    const doc = jsPDF();
    doc.__private__.setLayoutMode('continuous');
    expect(doc.__private__.getLayoutMode()).toEqual('continuous');
    expect(function() {doc.__private__.setLayoutMode('invalid');}).toThrow(new Error('Layout mode must be one of continuous, single, twoleft, tworight. "invalid" is not recognized.')); 
  });

  it('jsPDF private function setPageMode, getPageMode', () => {
    const doc = jsPDF();
    doc.__private__.setPageMode('UseNone');
    expect(doc.__private__.getPageMode()).toEqual('UseNone');
    expect(function() {doc.__private__.setPageMode('invalid');}).toThrow(new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "invalid" is not recognized.')); 
  });
  
  
  it('jsPDF private function setDisplayMode', () => {
    const doc = jsPDF();
    doc.__private__.setDisplayMode('200%', 'continuous', 'UseNone');
    expect(doc.__private__.getZoomMode()).toEqual('200%');
    expect(doc.__private__.getLayoutMode()).toEqual('continuous');
    expect(doc.__private__.getPageMode()).toEqual('UseNone');
  });
  
  it('jsPDF private function getTextColor', () => {
    const doc = jsPDF();
    expect(doc.__private__.getTextColor()).toEqual('#000000')
  });
  
  it('jsPDF private function setTextColor', () => {
    const doc = jsPDF();
    doc.__private__.setTextColor(255,0,0);
    expect(doc.__private__.getTextColor()).toEqual('#ff0000');
  });
  it('jsPDF private function getFillColor', () => {
    const doc = jsPDF();
    expect(doc.__private__.getFillColor()).toEqual('#000000')
  });
  
  it('jsPDF private function getFillColor', () => {
    const doc = jsPDF();
    doc.__private__.setFillColor(255,0,0);
    expect(doc.__private__.getFillColor()).toEqual('#ff0000');
  });
  
  it('jsPDF private function getStrokeColor', () => {
    const doc = jsPDF();
    expect(doc.__private__.getStrokeColor()).toEqual('#000000')
  });
  
  it('jsPDF private function setStrokeColor', () => {
    const doc = jsPDF();
    doc.__private__.setStrokeColor(255,0,0);
    expect(doc.__private__.getStrokeColor()).toEqual('#ff0000');
  });
  
  it('jsPDF private function encodeColorString', () => {
    const doc = jsPDF();
    expect(doc.__private__.encodeColorString({ch1: 255, ch2: 0, ch3: 0})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString({ch1: 255, ch2: 0, ch3: 0, precision: 2})).toEqual('1.00 0.00 0.00 rg');
    expect(doc.__private__.encodeColorString({ch1: 255, ch2: 0, ch3: 0, precision: 3})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString({ch1: 'red'})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString({ch1: '#f00'})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString({ch1: '#ff0000'})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString('red')).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString('#f00')).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString('#ff0000')).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString('gray')).toEqual('0.502 g');
    expect(doc.__private__.encodeColorString({ch1: 128, precision: 2})).toEqual('0.50 g'); 
    expect(doc.__private__.encodeColorString({ch1: 128, precision: 3})).toEqual('0.502 g'); 
    expect(doc.__private__.encodeColorString({ch1: '0.502'})).toEqual('0.502 g'); 
    expect(doc.__private__.encodeColorString({ch1: '1.000', ch2: '0.000', ch3: '0.000'})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString({ch1: 255, ch2: 0, ch3: 0, ch4: {a: 0}})).toEqual('1.000 1.000 1.000 rg');
    expect(doc.__private__.encodeColorString({ch1: 255, ch2: 0, ch3: 0, ch4: {a: 0.5}})).toEqual('1.000 0.000 0.000 rg');
    expect(doc.__private__.encodeColorString({ch1: 255, ch2: 0, ch3: 0, ch4: 255})).toEqual('1.000 0.000 0.000 1.000 k');
    expect(doc.__private__.encodeColorString({ch1: '1.000', ch2: '0.000', ch3: '0.000', ch4: '1.000'})).toEqual('1.000 0.000 0.000 1.000 k');
    expect(doc.__private__.encodeColorString({ch1: 255, ch2: 0, ch3: 0, ch4: 255, precision: 3})).toEqual('1.000 0.000 0.000 1.000 k');
    expect(doc.__private__.encodeColorString({ch1: 255, ch2: 0, ch3: 0, ch4: 255, precision: 2})).toEqual('1.00 0.00 0.00 1.00 k');
    expect(function() {doc.__private__.encodeColorString('invalid');}).toThrow(new Error('Invalid color "invalid" passed to jsPDF.encodeColorString.')); 
  });
  
  

  it('jsPDF private function getDocumentProperty, setDocumentProperty', () => {
    const doc = jsPDF();
    doc.__private__.setDocumentProperty('title', 'Title');
    expect(doc.__private__.getDocumentProperty('title')).toEqual('Title'); 
    
    expect(function() {doc.__private__.setDocumentProperty('invalid', 'Title');}).toThrow(new Error('Invalid arguments passed to jsPDF.setDocumentProperty')); 
    expect(function() {doc.__private__.getDocumentProperty('invalid');}).toThrow(new Error('Invalid argument passed to jsPDF.getDocumentProperty')); 
  });

  it('jsPDF private function getDocumentProperties, setDocumentProperties', () => {
    const doc = jsPDF();
    doc.__private__.setDocumentProperties({'title': 'Title'});
    expect(doc.__private__.getDocumentProperty('title')).toEqual('Title'); 

    expect(doc.__private__.getDocumentProperties()).toEqual({
      'title': 'Title',
      'subject': '',
      'author': '',
      'keywords': '',
      'creator': ''
    }); 

    // expect(function() {doc.__private__.setDocumentProperty('invalid', 'Title');}).toThrow(new Error('Invalid arguments passed to jsPDF.setDocumentProperty')); 
  });
  
  it('jsPDF private function isValidStyle', () => {
    const doc = jsPDF();

    expect(doc.__private__.isValidStyle('F')).toEqual(true); 
    expect(doc.__private__.isValidStyle('S')).toEqual(true); 
    expect(doc.__private__.isValidStyle('DF')).toEqual(true); 
    expect(doc.__private__.isValidStyle('X')).toEqual(false); 

  });
  it('jsPDF private function getStyle', () => {
    const doc = jsPDF();

    expect(doc.__private__.getStyle('F')).toEqual('f'); 
    expect(doc.__private__.getStyle('X')).toEqual('S'); 
    expect(doc.__private__.getStyle('S')).toEqual('S'); 
    expect(doc.__private__.getStyle('FD')).toEqual('B'); 
    expect(doc.__private__.getStyle('DF')).toEqual('B'); 
    expect(doc.__private__.getStyle('f')).toEqual('f'); 
    expect(doc.__private__.getStyle('f*')).toEqual('f*'); 
    expect(doc.__private__.getStyle('B')).toEqual('B'); 
    expect(doc.__private__.getStyle('B*')).toEqual('B*'); 

  });

  
  it('jsPDF private function lines', () => {
    var doc = jsPDF();
    
    
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110);
    expect(writeArray).toEqual(["600.945 530.079 m ","606.614 524.410 l","600.945 518.740 l","603.780 515.906 606.614 513.071 609.449 510.236 c","615.118 507.402 l","S"]);
    
    //old method header
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.lines(212, 110, [[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], [1,1]);
    expect(writeArray).toEqual(["600.945 530.079 m ","606.614 524.410 l","600.945 518.740 l","603.780 515.906 606.614 513.071 609.449 510.236 c","615.118 507.402 l","S"]);
        
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110, [1,1]);
    expect(writeArray).toEqual(["600.945 530.079 m ","606.614 524.410 l","600.945 518.740 l","603.780 515.906 606.614 513.071 609.449 510.236 c","615.118 507.402 l","S"]);
    
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110, [1,1], 'F');
    expect(writeArray).toEqual(["600.945 530.079 m ","606.614 524.410 l","600.945 518.740 l","603.780 515.906 606.614 513.071 609.449 510.236 c","615.118 507.402 l","f"]);
    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110);}).not.toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 

    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110, [1,1], null);
    expect(writeArray).toEqual(["600.945 530.079 m ","606.614 524.410 l","600.945 518.740 l","603.780 515.906 606.614 513.071 609.449 510.236 c","615.118 507.402 l"]);
    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110);}).not.toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 

    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110, [1,1]);}).not.toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 
    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110, [1,1], 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 
    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110, [1,1], 'F', false);}).not.toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 

    expect(function() {doc.__private__.lines('invalid', 212, 110, [1,1], 'F', false);}).toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 
    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 'invalid', 110, [1,1], 'F', false);}).toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 
    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 'invalid', [1,1], 'F', false);}).toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 
    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110, 'invalid', 'F', false);}).toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 
    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110, [1,1], 'invalid', false);}).toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 
    expect(function() {doc.__private__.lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212, 110, [1,1], 'F', 'invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.lines')); 

  });
  
  it('jsPDF private function line', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.line(1,2,3,4);}).not.toThrow(new Error('Invalid arguments passed to jsPDF.line')); 
    expect(function() {doc.__private__.line('invalid',2,3,4);}).toThrow(new Error('Invalid arguments passed to jsPDF.line')); 
    expect(function() {doc.__private__.line(1,'invalid',3,4);}).toThrow(new Error('Invalid arguments passed to jsPDF.line')); 
    expect(function() {doc.__private__.line(1,2,'invalid',4);}).toThrow(new Error('Invalid arguments passed to jsPDF.line')); 
    expect(function() {doc.__private__.line(1,2,3,'invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.line')); 

  });

  it('jsPDF private function triangle', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.triangle(1,2,3,4,5,6, 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle('invalid',2,3,4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,'invalid',3,4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,'invalid',4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,3,'invalid',5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,3,4,'invalid',6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,3,4,5,'invalid', 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 
    expect(function() {doc.__private__.triangle(1,2,3,4,5,6, 'invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.triangle')); 

    expect(doc.__private__.triangle(1,2,3,4,5,6, 'F')).toBe(doc.__private__); 
  });
  
  it('jsPDF private function roundedRect', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.roundedRect(1,2,3,4,5,6, 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect('undefined',2,3,4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,'undefined',3,4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,'undefined',4,5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,3,'undefined',5,6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,3,4,'undefined',6, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,3,4,5,'undefined', 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 
    expect(function() {doc.__private__.roundedRect(1,2,3,4,5,6, 'undefined');}).toThrow(new Error('Invalid arguments passed to jsPDF.roundedRect')); 

    expect(doc.__private__.roundedRect(1,2,3,4,5,6, 'F')).toBe(doc.__private__); 
  });
  
  it('jsPDF private function ellipse', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.ellipse(1,2,3,4, 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse('undefined',2,3,4, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse(1,'undefined',3,4, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse(1,2,'undefined',4, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse(1,2,3,'undefined', 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 
    expect(function() {doc.__private__.ellipse(1,2,3,4, 'undefined');}).toThrow(new Error('Invalid arguments passed to jsPDF.ellipse')); 


    expect(doc.__private__.ellipse(1,2,3,4, 'F')).toBe(doc.__private__); 

    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.ellipse(1,2,3,4, null);
    expect(writeArray).toEqual(['11.34 836.22 m 11.34 842.48 7.53 847.56 2.83 847.56 c', '-1.86 847.56 -5.67 842.48 -5.67 836.22 c', '-5.67 829.96 -1.86 824.88 2.83 824.88 c', '7.53 824.88 11.34 829.96 11.34 836.22 c']);

    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.ellipse(1,2,3,4, 'F');
    expect(writeArray).toEqual(['11.34 836.22 m 11.34 842.48 7.53 847.56 2.83 847.56 c', '-1.86 847.56 -5.67 842.48 -5.67 836.22 c', '-5.67 829.96 -1.86 824.88 2.83 824.88 c', '7.53 824.88 11.34 829.96 11.34 836.22 c', 'f']);
  });

  it('jsPDF private function rect', () => {
    const doc = jsPDF();
    
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.rect(1,2,3,4, 'F');
    expect(writeArray).toEqual(["2.83 836.22 8.50 -11.34 re","f"]);
    
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.rect(1,2,3,4, null);
    expect(writeArray).toEqual(["2.83 836.22 8.50 -11.34 re"]);

    expect(function() {doc.__private__.rect(1,2,3,4, 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.rect')); 
    expect(function() {doc.__private__.rect('invalid',2,3,4, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.rect')); 
    expect(function() {doc.__private__.rect(1,'invalid',3,4, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.rect')); 
    expect(function() {doc.__private__.rect(1,2,'invalid',4, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.rect')); 
    expect(function() {doc.__private__.rect(1,2,3,'invalid', 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.rect')); 
    expect(function() {doc.__private__.rect(1,2,3,4, 'invalid');}).toThrow(new Error('Invalid arguments passed to jsPDF.rect')); 

    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.rect(1,2,3,4, 'F');
    expect(writeArray).toEqual(['2.83 836.22 8.50 -11.34 re', 'f']);
    
    expect(doc.__private__.rect(1,2,3,4, 'F')).toBe(doc.__private__); 

  });

  it('jsPDF private function circle', () => {
    const doc = jsPDF();

    expect(function() {doc.__private__.circle(1,2,3, 'F');}).not.toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 
    expect(function() {doc.__private__.circle('undefined',2,3, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 
    expect(function() {doc.__private__.circle(1,'undefined',3, 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 
    expect(function() {doc.__private__.circle(1,2,'undefined', 'F');}).toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 
    expect(function() {doc.__private__.circle(1,2,3,'undefined');}).toThrow(new Error('Invalid arguments passed to jsPDF.circle')); 

    expect(doc.__private__.circle(1,2,3, 'F')).toBe(doc.__private__); 
  });

  it('jsPDF private function clip', () => {
    var doc = jsPDF();    
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.clip("evenodd");
    expect(writeArray).toEqual(['W*','n']);
    
    var doc = jsPDF();    
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.clip();
    expect(writeArray).toEqual(['W','n']);

  });

  it('jsPDF private function clip_fixed', () => {    
    var doc = jsPDF();    
    var writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.clip_fixed();
    expect(writeArray).toEqual(['W','n']);

  });

  
  it('jsPDF private function text', () => {
    var doc = jsPDF();

    var writeArray;
    
    //check for latest method header (text, x, y, options);
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text('This is a test.', 10, 10, {scope: doc});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //check for old method header (x, y, text);
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    
    //check for latest method header (text, x, y, options); text is Array
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(['This is a test.'], 10, 10, {scope: doc});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //multiline
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);    
    doc.__private__.text(`This is a line
break`, 10, 10, {scope: doc});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.35 813.54 Td', '(This is a line) Tj', 'T* (break) Tj', 'ET'].join("\n")]);
    
    //check for angle-functionality;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, angle: 10});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0.98 0.17 -0.17 0.98 28.35 813.54 Tm', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //check for charSpace-functionality;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, charSpace: 10});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.346 Tc', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //check for R2L-functionality;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, R2L: true});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.35 813.54 Td', '(.tset a si sihT) Tj', 'ET'].join("\n")]);
    
    //check for renderingMode-functionality - fill;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'fill'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 0});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: false});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
        
    //check for renderingMode-functionality - stroke;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'stroke'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '1 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 1});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '1 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: true});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '1 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //check for renderingMode-functionality - fillThenStroke;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'fillThenStroke'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '2 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 2});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '2 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //check for renderingMode-functionality - invisible;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'invisible'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '3 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 3});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '3 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
        
    //check for renderingMode-functionality - fillAndAddForClipping;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'fillAndAddForClipping'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '4 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 4});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '4 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
        
    //check for renderingMode-functionality - strokeAndAddPathForClipping;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'strokeAndAddPathForClipping'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '5 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 5});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '5 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
        
    //check for renderingMode-functionality - fillThenStrokeAndAddToPathForClipping;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'fillThenStrokeAndAddToPathForClipping'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '6 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 6});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '6 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
        
    //check for renderingMode-functionality - addToPathForClipping;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'addToPathForClipping'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '7 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 7});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '7 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    
    //check for renderingMode-functionality - reset on second call;
    
    doc = jsPDF();
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, renderingMode: 'addToPathForClipping'});
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '0 Tr', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //check for align-functionality - right;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(200, 10, 'This is a test.', {scope: doc, align: 'right'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '472.85 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //check for align-functionality - center;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(200, 10, 'This is a test.', {scope: doc, align: 'center'});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '519.89 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //check for align-functionality - center;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, align: 'justify', maxWidth: 30});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '12.84 Tw', '28.35 813.54 Td', '(This is a) Tj', '0.00 -18.40 Td', '(test.) Tj', 'ET'].join("\n")]);
    
    //check for align-functionality - throw Error;
    expect(function() {doc.__private__.text(200, 10, 'This is a test.', {scope: doc, align: 'invalid'})}).toThrow(new Error('Unrecognized alignment option, use "left", "center", "right" or "justify".')); 
    
    //check for maxWidth-functionality - too wide;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, maxWidth: 600});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.35 813.54 Td', '(This is a test.) Tj', 'ET'].join("\n")]);
    
    //check for maxWidth-functionality - has to split;
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.text(10, 10, 'This is a test.', {scope: doc, maxWidth: 30});
    expect(writeArray).toEqual([['BT', '/F1 16 Tf', '18.40 TL', '0 g', '28.35 813.54 Td', '(This is a) Tj', 'T* (test.) Tj', 'ET'].join("\n")]);
    
    });
  
  it('jsPDF private function setLineCap', () => {
    var doc = jsPDF();

    var writeArray;
    
    //miter/butt
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.setLineCap('miter');
    expect(writeArray).toEqual(['0 J']);
    expect(function() {doc.__private__.setLineCap('invalid');}).toThrow(new Error("Line cap style of 'invalid' is not recognized. See or extend .CapJoinStyles property for valid styles")); 
  })

  
  it('jsPDF private function setLineJoin', () => {
    var doc = jsPDF();

    var writeArray;
    
    //butt
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.setLineJoin('butt');
    expect(writeArray).toEqual(['0 j']);
    expect(function() {doc.__private__.setLineJoin('invalid');}).toThrow(new Error("Line join style of 'invalid' is not recognized. See or extend .CapJoinStyles property for valid styles")); 

  })
  
  it('jsPDF private function putHeader', () => {
    var doc = jsPDF();

    var writeArray;
    
    //without documentProperties
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putHeader();
    expect(writeArray).toEqual(['%PDF-1.3', '%ºß¬à']);

  })  
  
  it('jsPDF private function putCatalog', () => {
    var doc = jsPDF();
    var writeArray;
    
    //putCatalog, default Values
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj','<<','/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /OneColumn', '>>', 'endobj']);
  
  
    //putCatalog zoomModes
    doc = jsPDF();
    doc.__private__.setZoomMode(2);
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /XYZ null null 2.00]', '/PageLayout /OneColumn', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setZoomMode('200%');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /XYZ null null 2.00]', '/PageLayout /OneColumn', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setZoomMode('fullwidth');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /OneColumn', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setZoomMode('fullheight');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitV null]', '/PageLayout /OneColumn', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setZoomMode('fullpage');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /Fit]', '/PageLayout /OneColumn', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setZoomMode('original');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /XYZ null null 1]', '/PageLayout /OneColumn', '>>', 'endobj']);
    
    
    //putCatalog layoutModes
    doc = jsPDF();
    doc.__private__.setLayoutMode('continuous');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /OneColumn', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setLayoutMode('single');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /SinglePage', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setLayoutMode('twoleft');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /TwoColumnLeft', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setLayoutMode('two');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /TwoColumnLeft', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setLayoutMode('tworight');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /TwoColumnRight', '>>', 'endobj']);
    
    
    //putCatalog layoutModes
    doc = jsPDF();
    doc.__private__.setPageMode('UseNone');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /OneColumn', '/PageMode /UseNone', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setPageMode('UseOutlines');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /OneColumn', '/PageMode /UseOutlines', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setPageMode('UseThumbs');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /OneColumn', '/PageMode /UseThumbs', '>>', 'endobj']);
    
    doc = jsPDF();
    doc.__private__.setPageMode('FullScreen');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putCatalog();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Type /Catalog', '/Pages 1 0 R', '/OpenAction [3 0 R /FitH null]', '/PageLayout /OneColumn', '/PageMode /FullScreen', '>>', 'endobj']);
    
  });
  
  it('jsPDF private function putInfo', () => {
    var doc = jsPDF();

    var writeArray;
    
    //without documentProperties
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    var pdfDateString = "D:19871210000000+00'00'";
    doc.__private__.setCreationDate(pdfDateString);
    doc.__private__.putInfo();
    expect(writeArray).toEqual(['3 0 obj', '<<', '/Producer (jsPDF 0.0.0)',"/CreationDate (D:19871210000000+00'00')", '>>', 'endobj']);    
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    var pdfDateString = "D:19871210000000+00'00'";
    doc.__private__.setCreationDate(pdfDateString);
    
    doc.__private__.setDocumentProperties({
      'title': 'Title',
      'subject': 'Subject',
      'author': 'Author X',
      'keywords': 'Keyword1, Keyword2',
      'creator': 'Creator'
    });
    doc.__private__.putInfo();
    expect(writeArray).toEqual(['3 0 obj', '<<','/Producer (jsPDF 0.0.0)','/Title (Title)', '/Subject (Subject)', '/Author (Author X)','/Keywords (Keyword1, Keyword2)','/Creator (Creator)', "/CreationDate (D:19871210000000+00'00')", '>>', 'endobj']);
  })
  
  it('jsPDF private function putTrailer', () => {
    var doc = jsPDF();

    var writeArray;
    
    //without documentProperties
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    
    doc.__private__.setFileId('0000000000000000000000000BADFACE')
    doc.__private__.putTrailer();
    expect(writeArray).toEqual(['trailer','<<','/Size 3', '/Root 2 0 R', '/Info 1 0 R', '/ID [ <0000000000000000000000000BADFACE> <0000000000000000000000000BADFACE> ]', '>>']);
  })
  
  it('jsPDF private function putXRef', () => {
    var doc = jsPDF();
    var writeArray;
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putXRef();
    expect(writeArray).toEqual(['xref', '0 3', '0000000000 65535 f ','0000000000 00000 n ','0000000000 00000 n ']);
  })
  
  it('jsPDF private function putStream', () => {
    var doc = jsPDF();
    var writeArray;
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putStream({data:'someData',filters: [], alreadyAppliedFilters: []});
    expect(writeArray).toEqual(["<<","/Length 8",">>","stream","someData","endstream"]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putStream({data:'someData',filters: [], alreadyAppliedFilters: [], addLength1: true});
    expect(writeArray).toEqual(["<<","/Length 8","/Length1 8",">>","stream","someData","endstream"]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putStream({data:'someData',filters: [], alreadyAppliedFilters: ['/FlateDecode', '/SomeFilter']});
    expect(writeArray).toEqual(["<<","/Length 8","/Filter [/FlateDecode /SomeFilter]",">>","stream","someData","endstream"]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putStream({data:'someData',filters: [], alreadyAppliedFilters: '/FlateDecode /SomeFilter'});
    expect(writeArray).toEqual(["<<","/Length 8","/Filter [/FlateDecode /SomeFilter]",">>","stream","someData","endstream"]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putStream();
    expect(writeArray).toEqual(["<<",">>"]);
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putStream({data: 'streamData', filters: ['FlateEncode'] });
    expect(writeArray).toEqual(["<<","/Length 18","/Filter /FlateDecode",">>","stream","x+.)JMÌuI,I\u0004\u0000\u0007\u0004Ò\u0016","endstream"]);    

    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putStream({data: 'streamData', filters: true });
    expect(writeArray).toEqual(["<<","/Length 18","/Filter /FlateDecode",">>","stream","x+.)JMÌuI,I\u0004\u0000\u0007\u0004Ò\u0016","endstream"]);
  
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putStream({data: "x+.)JMÌuI,I\u0004\u0000\u0007\u0004Ò\u0016", alreadyAppliedFilters: ['/FlateDecode'] });
    expect(writeArray).toEqual(["<<","/Length 18","/Filter /FlateDecode",">>","stream","x+.)JMÌuI,I\u0004\u0000\u0007\u0004Ò\u0016","endstream"]);
  })
  
  it('jsPDF private function putPage', () => {
    var doc = jsPDF();
    var writeArray;
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.putPage({number: 1, data:['streamData'], dimensions: {width: 595.28, height: 841.89}});
    expect(writeArray).toEqual(["3 0 obj","<</Type /Page","/Parent 1 0 R","/Resources 2 0 R","/MediaBox [0 0 1687.41 2386.46]","/Contents 4 0 R",">>","endobj","4 0 obj","<<","/Length 10",">>","stream","streamData","endstream","endobj"]);
  })
  
  it('jsPDF private function buildDocument', () => {
    var doc = jsPDF();

    var writeArray;
    
    doc = jsPDF();
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.setFileId('0000000000000000000000000BADFACE');
    doc.__private__.setCreationDate("D:19871210000000+00'00'");
    doc.__private__.buildDocument();
    expect(writeArray).toEqual(["%PDF-1.3","%ºß¬à","3 0 obj","<</Type /Page","/Parent 1 0 R","/Resources 2 0 R","/MediaBox [0 0 595.28 841.89]","/Contents 4 0 R",">>","endobj","4 0 obj","<<","/Length 10",">>","stream","0.57 w\n0 G","endstream","endobj","1 0 obj","<</Type /Pages","/Kids [3 0 R ]","/Count 1",">>","endobj","5 0 obj","<<","/Type /Font","/BaseFont /Helvetica","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","6 0 obj","<<","/Type /Font","/BaseFont /Helvetica-Bold","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","7 0 obj","<<","/Type /Font","/BaseFont /Helvetica-Oblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","8 0 obj","<<","/Type /Font","/BaseFont /Helvetica-BoldOblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","9 0 obj","<<","/Type /Font","/BaseFont /Courier","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","10 0 obj","<<","/Type /Font","/BaseFont /Courier-Bold","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","11 0 obj","<<","/Type /Font","/BaseFont /Courier-Oblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","12 0 obj","<<","/Type /Font","/BaseFont /Courier-BoldOblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","13 0 obj","<<","/Type /Font","/BaseFont /Times-Roman","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","14 0 obj","<<","/Type /Font","/BaseFont /Times-Bold","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","15 0 obj","<<","/Type /Font","/BaseFont /Times-Italic","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","16 0 obj","<<","/Type /Font","/BaseFont /Times-BoldItalic","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","17 0 obj","<<","/Type /Font","/BaseFont /ZapfDingbats","/Subtype /Type1","/FirstChar 32","/LastChar 255",">>","endobj","18 0 obj","<<","/Type /Font","/BaseFont /Symbol","/Subtype /Type1","/FirstChar 32","/LastChar 255",">>","endobj","2 0 obj","<<","/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]","/Font <<","/F1 5 0 R","/F2 6 0 R","/F3 7 0 R","/F4 8 0 R","/F5 9 0 R","/F6 10 0 R","/F7 11 0 R","/F8 12 0 R","/F9 13 0 R","/F10 14 0 R","/F11 15 0 R","/F12 16 0 R","/F13 17 0 R","/F14 18 0 R",">>","/XObject <<",">>",">>","endobj","19 0 obj","<<","/Producer (jsPDF 0.0.0)","/CreationDate (D:19871210000000+00'00')",">>","endobj","20 0 obj","<<","/Type /Catalog","/Pages 1 0 R","/OpenAction [3 0 R /FitH null]","/PageLayout /OneColumn",">>","endobj","xref","0 21","0000000000 65535 f ","0000000184 00000 n ","0000002001 00000 n ","0000000015 00000 n ","0000000124 00000 n ","0000000241 00000 n ","0000000366 00000 n ","0000000496 00000 n ","0000000629 00000 n ","0000000766 00000 n ","0000000889 00000 n ","0000001018 00000 n ","0000001150 00000 n ","0000001286 00000 n ","0000001414 00000 n ","0000001541 00000 n ","0000001670 00000 n ","0000001803 00000 n ","0000001905 00000 n ","0000002249 00000 n ","0000002335 00000 n ","trailer","<<","/Size 21","/Root 20 0 R","/Info 19 0 R","/ID [ <0000000000000000000000000BADFACE> <0000000000000000000000000BADFACE> ]",">>","startxref","2439","%%EOF"]);

    doc = jsPDF('l');
    writeArray = [];
    doc.__private__.setCustomOutputDestination(writeArray);
    doc.__private__.setFileId('0000000000000000000000000BADFACE');
    doc.__private__.setCreationDate("D:19871210000000+00'00'");
    doc.__private__.buildDocument();
    expect(writeArray).toEqual(["%PDF-1.3","%ºß¬à","3 0 obj","<</Type /Page","/Parent 1 0 R","/Resources 2 0 R","/MediaBox [0 0 841.89 595.28]","/Contents 4 0 R",">>","endobj","4 0 obj","<<","/Length 10",">>","stream","0.57 w\n0 G","endstream","endobj","1 0 obj","<</Type /Pages","/Kids [3 0 R ]","/Count 1",">>","endobj","5 0 obj","<<","/Type /Font","/BaseFont /Helvetica","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","6 0 obj","<<","/Type /Font","/BaseFont /Helvetica-Bold","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","7 0 obj","<<","/Type /Font","/BaseFont /Helvetica-Oblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","8 0 obj","<<","/Type /Font","/BaseFont /Helvetica-BoldOblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","9 0 obj","<<","/Type /Font","/BaseFont /Courier","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","10 0 obj","<<","/Type /Font","/BaseFont /Courier-Bold","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","11 0 obj","<<","/Type /Font","/BaseFont /Courier-Oblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","12 0 obj","<<","/Type /Font","/BaseFont /Courier-BoldOblique","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","13 0 obj","<<","/Type /Font","/BaseFont /Times-Roman","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","14 0 obj","<<","/Type /Font","/BaseFont /Times-Bold","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","15 0 obj","<<","/Type /Font","/BaseFont /Times-Italic","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","16 0 obj","<<","/Type /Font","/BaseFont /Times-BoldItalic","/Subtype /Type1","/Encoding /WinAnsiEncoding","/FirstChar 32","/LastChar 255",">>","endobj","17 0 obj","<<","/Type /Font","/BaseFont /ZapfDingbats","/Subtype /Type1","/FirstChar 32","/LastChar 255",">>","endobj","18 0 obj","<<","/Type /Font","/BaseFont /Symbol","/Subtype /Type1","/FirstChar 32","/LastChar 255",">>","endobj","2 0 obj","<<","/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]","/Font <<","/F1 5 0 R","/F2 6 0 R","/F3 7 0 R","/F4 8 0 R","/F5 9 0 R","/F6 10 0 R","/F7 11 0 R","/F8 12 0 R","/F9 13 0 R","/F10 14 0 R","/F11 15 0 R","/F12 16 0 R","/F13 17 0 R","/F14 18 0 R",">>","/XObject <<",">>",">>","endobj","19 0 obj","<<","/Producer (jsPDF 0.0.0)","/CreationDate (D:19871210000000+00'00')",">>","endobj","20 0 obj","<<","/Type /Catalog","/Pages 1 0 R","/OpenAction [3 0 R /FitH null]","/PageLayout /OneColumn",">>","endobj","xref","0 21","0000000000 65535 f ","0000000184 00000 n ","0000002001 00000 n ","0000000015 00000 n ","0000000124 00000 n ","0000000241 00000 n ","0000000366 00000 n ","0000000496 00000 n ","0000000629 00000 n ","0000000766 00000 n ","0000000889 00000 n ","0000001018 00000 n ","0000001150 00000 n ","0000001286 00000 n ","0000001414 00000 n ","0000001541 00000 n ","0000001670 00000 n ","0000001803 00000 n ","0000001905 00000 n ","0000002249 00000 n ","0000002335 00000 n ","trailer","<<","/Size 21","/Root 20 0 R","/Info 19 0 R","/ID [ <0000000000000000000000000BADFACE> <0000000000000000000000000BADFACE> ]",">>","startxref","2439","%%EOF"]);

  })
  
});