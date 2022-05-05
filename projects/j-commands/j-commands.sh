script_path=`readlink ~/.j-commands.sh`

project_dir=`dirname $script_path`

function j () {
	func_name=$1
	echo $func_name
}

alias flame_graph="bash $project_dir/plugins/flame_graph.sh"
