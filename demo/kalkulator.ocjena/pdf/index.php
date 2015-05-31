<?php

	date_default_timezone_set('UTC');

	require_once('../lib/tcpdf/tcpdf_include.php');

	$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

	$pdf->SetAuthor('fffilo');
	$pdf->SetTitle('Kalkulator ocjena');
	$pdf->SetSubject('Kalkulator ocjena');
	$pdf->SetPrintHeader(false);
	$pdf->SetPrintFooter(false);
	$pdf->SetMargins(20,20,20);
	$pdf->SetHeaderMargin(0);
	$pdf->SetFooterMargin(0);
	$pdf->SetAutoPageBreak(false);
	$pdf->SetPageOrientation('P');
	$pdf->SetFont('ubuntu', '', 24, '', false);

	$pdf->AddPage();
	//Cell ($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='', $stretch=0, $ignore_min_height=false, $calign='T', $valign='M')
	$pdf->Cell(170, 10, 'U izradi...', 0, 1, 'C', false);

	$pdf->Output('KalkulatorOcjena.pdf', 'I');
