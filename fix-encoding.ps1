# Script pour corriger l'encodage UTF-8 dans tous les fichiers HTML
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html" -Recurse

# Table de correspondance des caractères mal encodés
$replacements = @{
    "Ã©" = "é"
    "Ã¨" = "è"
    "Ã " = "à"
    "Ã´" = "ô"
    "Ã®" = "î"
    "Ã»" = "û"
    "Ã§" = "ç"
    "Ã€" = "À"
    "Â©" = "©"
    "Ã¢" = "â"
    "Ã«" = "ë"
    "Ãª" = "ê"
    "Ã¹" = "ù"
    "Ã‰" = "É"
    "Ã" = "È"
    "Ã‡" = "Ç"
    "Ã"" = "Ô"
    "Ã®" = "Î"
    "Ã›" = "Û"
}

$totalFiles = 0
$totalReplacements = 0

foreach ($file in $htmlFiles) {
    Write-Host "Traitement de $($file.FullName)..."
    
    # Lire le contenu avec UTF-8
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $originalContent = $content
    
    # Appliquer tous les remplacements
    foreach ($key in $replacements.Keys) {
        $count = ([regex]::Matches($content, [regex]::Escape($key))).Count
        if ($count -gt 0) {
            $content = $content.Replace($key, $replacements[$key])
            $totalReplacements += $count
            Write-Host "  - Remplacé '$key' par '$($replacements[$key])' : $count fois"
        }
    }
    
    # Sauvegarder seulement si des changements ont été faits
    if ($content -ne $originalContent) {
        $content | Out-File -FilePath $file.FullName -Encoding UTF8 -NoNewline
        $totalFiles++
        Write-Host "  ✓ Fichier mis à jour" -ForegroundColor Green
    } else {
        Write-Host "  - Aucun changement nécessaire" -ForegroundColor Gray
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Correction terminée!" -ForegroundColor Green
Write-Host "Fichiers traités: $totalFiles" -ForegroundColor Yellow
Write-Host "Total de remplacements: $totalReplacements" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
