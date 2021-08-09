#!/bin/sh
# Redirect output to stderr.
exec 1>&2
# enable user input
exec </dev/tty

# consoleregexp='console.log' # CHECK
consoleregexp="console.(log|debug|info|count|debug|table)\((.*)\)"

if test $(git diff --cached | grep "console." | wc -l) != 0; then
	read -p "There are some occurrences of console.log at your modification. Do you want to delete them? (y/n)" yn
	echo $yn | grep  ^[Yy]$
	if [ $? -eq 0 ]; then
		echo "\nDeleting all console.logs...\n"
		flag=Off
	else
		echo "\nCommenting all console.logs...\n"
		flag=ON
	fi
	files=$(git diff-index --name-only --diff-filter=ACM HEAD | grep 'src')
	for file in $files; do
		if [ "$flag" = "ON" ]; then
			awk '/console.(log|debug|info|count)\((.*)\)/ { $0 = "//"$0 }; 1' $file > temp.text && mv temp.text $file
		else
			awk '!/console.(log|debug|info|count)\((.*)\)/'  $file > temp.text && mv temp.text $file
		fi
	done
	git add -A
	echo "\nDone!\n"
fi
